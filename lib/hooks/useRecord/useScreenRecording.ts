'use client'

import { 
  useState, 
  useRef, 
  useEffect
} from "react";
import {
  getMediaStreams,
  createAudioMixer,
  setupRecording,
  cleanupRecording,
  createRecordingBlob,
  calculateRecordingDuration,
  getTrackSetting,
  addTrack,
  streamMonitor,
  killMediaStreams,
  fileToBase64,
  generateScreenShotName,
  getCanvasProcessor,
  formatTimer,
  getVideoProcessor,
} from "@/lib/utils";
import {
  BunnyRecordingState, 
  CanvasProcessor, 
  DisplaySurfaceOptions, 
  ExtendedMediaStream, 
  ImagesArrayType, 
  RecordingTimerType, 
  StreamSettingsType, 
  VideoSettingsType 
} from "@/index";
import { VoidAction, useModalContext } from "../useModalContext";

//IMPROVEMENTS

/*
Poor screenshot quality and implementation (getVideoProcessor)

RecordingTimer not functioning right. Can get a better implementation.

Broken video duration show on successful load action
*/

const useScreenRecording = () => {

  const {
    changeState,
    failedAction,
    successfulAction,
    changeImageFS,  
    changeImageFSActions, 
  } = useModalContext()
  
  const COUNT_LIMIT = 60;
  let seconds = 0;
  let minutes = 0;
  let hour = 0
  let countInterval: NodeJS.Timeout | null = null; 

  const [state, setState] = useState<BunnyRecordingState>({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
    recordingStatus: 'inactive',
  });

  const [recordingTimer, setRecordingTimer] = useState<RecordingTimerType>({
    hour: '', 
    minutes: '00', 
    seconds: '00'
  })
  
  const [streamSettings, setStreamSettings] = useState<StreamSettingsType>({
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

  const canvasProcessorRef = useRef<CanvasProcessor | null>(null)
  const videoProcessorRef = useRef<Omit<CanvasProcessor, 'stopLoop' | 'stream'> | null>(null)

  useEffect(() => {
    return () => {
      stopRecording();
      if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);

      if(audioContextRef.current?.state !== "closed"){
        audioContextRef.current?.close().catch(console.error);
      }

      audioContextRef.current = null;
    };
  }, [/*state.recordedVideoUrl*/]);

  //Recording timer implementation
  const updateTimer = () => {
    // console.log(seconds, minutes)

    if (seconds < COUNT_LIMIT) {
      seconds ++;
    } 
    
    if (seconds === COUNT_LIMIT) {
      minutes ++;
      seconds = 0;
    }

    if(minutes === COUNT_LIMIT) {
      hour ++;
      minutes = 0;
    }

    setRecordingTimer({
      hour: formatTimer(hour), 
      minutes: formatTimer(minutes), 
      seconds: formatTimer(seconds)
    })
  };

  const startTimer = () => { 
    countInterval = setInterval(() => {
      updateTimer();
      return () => clearInterval(countInterval as NodeJS.Timeout)
    }, 1000);

  }

  const pauseTimer = () => clearInterval(countInterval as NodeJS.Timeout);

  const resetTimer = () => {

    pauseTimer()
    
    seconds = 0;
    minutes = 0;
    hour = 0;

    setRecordingTimer({
      hour: '', 
      minutes: '00', 
      seconds: '00'
    })
  }
  //------------------

  const onRecordingStop = () => {
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

  const startRecording = async (videoSettings: VideoSettingsType)=> {
    setStreamSettings(prev => ({...prev, ...videoSettings}))
    console.log(videoSettings)

    try {
      stopRecording();

      const streams = await getMediaStreams(videoSettings);

      changeState('ongoing', 'record');

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
        
        setStreamSettings(prev => ({
          ...prev, 
          displaySurface, 
          systemAudio
        }));

        console.log("starting to combine user stream")

        if(userMediaStream && userMediaStream?.getVideoTracks().length > 0) {

          const usingMic = userMediaStream.getAudioTracks().length > 0;

          setStreamSettings(prev => ({
            ...prev, 
            camera: "with",
            withMic: usingMic ? true : false,
          }))

          const processor = await getCanvasProcessor(
            displayStream, 
            userMediaStream, 
            videoSettings.camera === 'with'
          );

          await addTrack(processor.stream, combinedStream, "both");
          
          canvasProcessorRef.current = processor;

        }else {
          if(userMediaStream && userMediaStream?.getAudioTracks().length > 0) {
            setStreamSettings(prev => ({
              ...prev, 
              withMic: true,
              camera: "no"
            }))
          }

          if(!userMediaStream) {
            setStreamSettings(prev => ({
              ...prev, 
              withMic: false, 
              camera: 'no'
            }))
          }
          // const processor = await getCanvasProcessor(displayStream);

          // canvasProcessorRef.current = processor;

          const videoProcessor = await getVideoProcessor(displayStream);

          videoProcessorRef.current = videoProcessor;

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

          setStreamSettings(prev => ({
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
          onStop: onRecordingStop,
        }
      )

      streamRef.current = recorderStream;

      console.log(mediaRecorderRef.current)

      chunksRef.current = [];
      startTimeRef.current = Date.now();

      if(recorderStream.getVideoTracks().some(track => track.readyState === "live")){
        mediaRecorderRef.current.start(1000);

        successfulAction('record');

        setState((prev) => ({
          ...prev, 
          isRecording: true, 
          recordingStatus: 'recording'
        }));
  
        startTimer();
      }
      

      return true;

    } catch (error) {
      stopRecording();
      console.error("Recording error:", error);
      failedAction('record');
      throw error;
    }
  };

  const stopRecording = () => {
    try {
      cleanupRecording(
        mediaRecorderRef.current,
        streamRef.current,
        streamRef.current?._originalStreams,
        videoProcessorRef.current?.end as VoidAction
        // canvasProcessorRef.current?.end!
      );
      // videoProcessorRef.current?.end();
      streamRef.current = null;
      canvasProcessorRef.current = null;
      pauseTimer();
      setState((prev) => ({ 
        ...prev, 
        isRecording: false, 
        recordingStatus: 'inactive' 
      }));
    } catch (error) {
      throw error;
    }
  };

  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
    resetTimer()
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
      recordingStatus: 'inactive',
    });
    startTimeRef.current = null;
  };

  const onPauseResume = () => {
    if(!mediaRecorderRef.current) return;

    if(state.recordingStatus === "recording") {
      mediaRecorderRef.current.pause();
      // if(canvasProcessorRef.current) canvasProcessorRef.current?.pause();
      if(videoProcessorRef.current) videoProcessorRef.current?.pause();
      pauseTimer();
      
      setState(prev => ({...prev, recordingStatus: 'paused'}))
    } else if (state.recordingStatus === 'paused') {
      mediaRecorderRef.current.resume();
      // if(canvasProcessorRef.current) canvasProcessorRef.current?.resume();
      if(videoProcessorRef.current) videoProcessorRef.current?.resume();
      startTimer();

      setState(prev => ({...prev, recordingStatus: 'recording'}))
    }
  }

  const onTakeScreenShot = (): Promise<ImagesArrayType | null> => {
    return new Promise (async(resolve, reject) => {
      try {
        // if(!canvasProcessorRef.current) return;
        if(!videoProcessorRef.current) return;
  
        const imageFile = await videoProcessorRef.current.takeScreenShot();
    
        // const imageFile = await canvasProcessorRef.current?.takeScreenShot();
    
        const url = await fileToBase64(imageFile);
    
        const name = generateScreenShotName();

        const newShot = {
          url, 
          name, 
          type: imageFile.type,
          selected: false
        }

        changeImageFS(newShot);

        setTimeout(() => changeImageFSActions({flash: true}), 500);
        setTimeout(() => changeImageFSActions(null), 700);
        setTimeout(() => changeImageFS(null), 1500);
    
        resolve (newShot)
      } catch (error) {
        reject(error);
      }
    }) 
  }

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    streamSettings,
    recordingTimer,
    onPauseResume,
    onTakeScreenShot,
  };
};

export default useScreenRecording;