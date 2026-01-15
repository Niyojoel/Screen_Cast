'use client'

import { useState, useRef, useEffect} from "react";
import {
  getMediaStreams,
  createAudioMixer,
  setupRecording,
  cleanupRecording,
  createRecordingBlob,
  calculateRecordingDuration,
  getCombinedCanvasStreams,
  getTrackSetting,
  addTrack,
  streamMonitor,
  killMediaStreams,
} from "@/lib/utils";
import { BunnyRecordingState, DisplaySurfaceOptions, ExtendedMediaStream, VideoSettingsType } from "@/index";

export const useScreenRecording = () => {

  const [state, setState] = useState<BunnyRecordingState>({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
  });

  const [selectedVideoSetting, setSelectedVideoSetting] = useState<VideoSettingsType & {systemAudio: boolean}>({
    cursor: "always",
    displaySurface: "monitor",
    camera: 'no',
    cameraFacingMode: 'user',
    withMic: true, 
    systemAudio: false
  })

  const [isPreviewing, setIsPreviewing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<ExtendedMediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const drawIntervalRef = useRef<() => void>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);

      if(audioContextRef.current?.state !== "closed"){
        audioContextRef.current?.close().catch(console.error);
      }

      audioContextRef.current = null;
    };
  }, [state.recordedVideoUrl]);

  const handleRecordingStop = () => {
    const { blob, url } = createRecordingBlob(chunksRef.current);

    console.log({blob, url})
    const duration = calculateRecordingDuration(startTimeRef.current);

    setState((prev) => ({
      ...prev,
      recordedBlob: blob,
      recordedVideoUrl: url,
      recordingDuration: duration,
      isRecording: false,
    }));
  };

  let canvasDrawInterval: NodeJS.Timeout | null = null;

  const startRecording = async (videoSettings: VideoSettingsType) => {
    setSelectedVideoSetting(prev => ({...prev, ...videoSettings}))
    console.log(videoSettings)
    try {
      stopRecording();

      const streams = await getMediaStreams(videoSettings);

      const {
        displayStream, 
        userMediaStream, 
        hasDisplayAudio
      } = streams;

      console.log({displayStream, userMediaStream, hasDisplayAudio})

      if(!displayStream && !userMediaStream) {
        killMediaStreams([streams?.displayStream, streams?.userMediaStream]);
        throw new Error('No media to stream. Please try again')
      }

      if(videoSettings.camera !== 'no' && userMediaStream?.getVideoTracks.length === 0) {
        killMediaStreams([streams?.displayStream, streams?.userMediaStream]);
        console.log('camera not active')
        throw new Error('Could not access camera. Please allow camera permissions.')
      }

      const recorderStream = new MediaStream() as ExtendedMediaStream;

        if(displayStream) { 

          console.log("in displayStream")

          const combinedStream = new MediaStream();

          audioContextRef.current = new AudioContext();

          console.log("getting settings")
          //Get the user browser dialog selected option
          const setting = getTrackSetting(displayStream);
          const displaySurface = setting['displaySurface'] as DisplaySurfaceOptions;
          const systemAudio = displayStream.getAudioTracks().length > 0;
          
          setSelectedVideoSetting(prev => ({
            ...prev, 
            displaySurface, 
            systemAudio
          }));

          console.log("starting to combine user stream")

          if(userMediaStream && userMediaStream?.getVideoTracks().length > 0) {

            const usingMic = userMediaStream.getAudioTracks().length > 0;

            setSelectedVideoSetting(prev => ({
              ...prev, 
              camera: "with",
              withMic: usingMic ? true : false,
            }))

            const {stream, stopDrawInterval} = await getCombinedCanvasStreams(displayStream, userMediaStream);

            await addTrack(stream, combinedStream, "both");
            
            drawIntervalRef.current = stopDrawInterval;

          }else {
            if(userMediaStream && userMediaStream?.getAudioTracks().length > 0) {
              setSelectedVideoSetting(prev => ({
                ...prev, 
                withMic: true,
                camera: "no"
              }))
            }

            if(!userMediaStream) {
              setSelectedVideoSetting(prev => ({
                ...prev, 
                withMic: false, 
                camera: 'no'
              }))
            }

            await addTrack(displayStream, combinedStream, "video")
          }

          console.log("just added video to combined: ", combinedStream.getVideoTracks().length);

          console.log("DisplayStream Audio", displayStream.getAudioTracks().length > 0)

          console.log(hasDisplayAudio);

          const audioDestination = await createAudioMixer(
            audioContextRef.current, 
            displayStream, 
            userMediaStream, 
            hasDisplayAudio
          );

          if(audioDestination) {
            await addTrack(audioDestination?.stream, combinedStream, "audio")
          }

          console.log("just added audio to combined: ", combinedStream.getAudioTracks());

          await addTrack(combinedStream, recorderStream, "both")

          recorderStream._originalStreams = [
            displayStream,
            ...(userMediaStream ? [userMediaStream] : [])
          ];

        }else {
          if(videoRef.current){
            videoRef.current.srcObject = userMediaStream;
            setIsPreviewing(true);

            setSelectedVideoSetting(prev => ({
              ...prev, 
              camera: "only", 
              displaySurface: 'camera only', 
              withMic: true
            }))

            if(userMediaStream){
              await addTrack(userMediaStream, recorderStream, "both")
  
              recorderStream._originalStreams = [userMediaStream]
            }
          }
        };

        if(!(recorderStream && recorderStream.getTracks().length > 0)) throw new Error("Cannot start recording: No video or audio track present")

        const trackStatus = {
          video: recorderStream?.getVideoTracks().length > 0,
          audio: recorderStream?.getAudioTracks().length > 0,
        };

        const streamStatus = await streamMonitor(recorderStream);

        console.log("Track check status: ", trackStatus);
        console.log("Track stream status: ", streamStatus);

        mediaRecorderRef
        .current = setupRecording(recorderStream, 
          {
            onDataAvailable: (e) => e.data.size && chunksRef.current.push(e.data),
            onStop: handleRecordingStop,
          }
        )

        streamRef.current = recorderStream;

        console.log(mediaRecorderRef.current)

        chunksRef.current = [];
        startTimeRef.current = Date.now();

        if(recorderStream.getVideoTracks().some(track => track.readyState === "live")){
          mediaRecorderRef.current.start(1000);
        }
  
        setState((prev) => ({ ...prev, isRecording: true }));
        return true;

    } catch (error) {
      stopRecording();
      console.error("Recording error:", error);
      throw error;
    }
  };

  const stopRecording = () => {
    cleanupRecording(
      mediaRecorderRef.current,
      streamRef.current,
      streamRef.current?._originalStreams,
      drawIntervalRef?.current as () => void
    );
    streamRef.current = null;
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
    });
    startTimeRef.current = null;
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    selectedVideoSetting
  };
};
