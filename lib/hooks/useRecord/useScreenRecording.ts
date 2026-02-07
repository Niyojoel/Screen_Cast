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
  getStreamShot,
} from "@/lib/utils";
import {
  BunnyRecordingState, 
  CanvasProcessor, 
  DisplaySurfaceOptions, 
  ExtendedMediaStream, 
  ImagesArrayType, 
  StreamSettingsType, 
  VideoSettingsType 
} from "@/index";

export const useScreenRecording = () => {

  const COUNT_LIMIT = 60;
  let seconds = 0;
  let minutes = 0;
  let hour = 0
  let countInterval: number | null = null; 

  const [state, setState] = useState<BunnyRecordingState>({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
    recordingStatus: 'inactive',
  });

  const [recordingTimer, setRecordingTimer] = useState({
    hour: '', 
    minutes: '00', 
    seconds: '00'
  })

  const [screenShots, setScreenShots] = useState<ImagesArrayType[]>([])

  const [streamSettings, setStreamSettings] = useState<StreamSettingsType>({
    cursor: "always",
    displaySurface: "monitor",
    camera: 'no',
    cameraFacingMode: 'user',
    withMic: true, 
    systemAudio: false
  })

  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [capture, setCapture] = useState<ImagesArrayType | null>(null);
  
  const [isFlashing, setIsFlashing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<ExtendedMediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const canvasProcessorRef = useRef<CanvasProcessor | null>(null)

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

  const updateTimer = () => {
    console.log(seconds, minutes)
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
    countInterval = window.setInterval(updateTimer, 1000);

    clearInterval(countInterval);
  }

  const resetTimer = () => {
    clearInterval(countInterval as number);
    
    seconds = 0;
    minutes = 0;
    hour = 0;

    setRecordingTimer({
      hour: '', 
      minutes: '00', 
      seconds: '00'
    })
  }

  const pauseTimer = () => {
    clearInterval(countInterval as number)
  }

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

  const startRecording = async (
    videoSettings: VideoSettingsType, 
    onBrowserDialogComplete: () => void,
    onBrowserDialogCancelled: () => void
  )=> {
    setStreamSettings(prev => ({...prev, ...videoSettings}))
    console.log(videoSettings)

    try {
      stopRecording();
      setScreenShots([])

      const streams = await getMediaStreams(videoSettings);

      onBrowserDialogComplete();

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
          onStop: handleRecordingStop,
        }
      )

      streamRef.current = recorderStream;

      console.log(mediaRecorderRef.current)

      chunksRef.current = [];
      startTimeRef.current = Date.now();

      if(recorderStream.getVideoTracks().some(track => track.readyState === "live")){
        mediaRecorderRef.current.start(1000);
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
      onBrowserDialogCancelled();
      throw error;
    }
  };

  const stopRecording = () => {
    try {
      pauseTimer();
      cleanupRecording(
        mediaRecorderRef.current,
        streamRef.current,
        streamRef.current?._originalStreams,
        canvasProcessorRef.current?.end!
      );
      streamRef.current = null;
      canvasProcessorRef.current = null;
      setState((prev) => ({ ...prev, isRecording: false }));
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

  const handlePauseResume = () => {
    if(!mediaRecorderRef.current) return;

    if(state.recordingStatus === "recording") {
      mediaRecorderRef.current.pause();
      if(canvasProcessorRef.current) canvasProcessorRef.current?.pause();
      pauseTimer();
      
      setState(prev => ({...prev, recordingStatus: 'paused'}))
    } else if (state.recordingStatus === 'paused') {
      mediaRecorderRef.current.resume();
      if(canvasProcessorRef.current) canvasProcessorRef.current?.resume();
      startTimer();

      setState(prev => ({...prev, recordingStatus: 'recording'}))
    }
  }

  const handleTakeScreenShot = async () => {
    try {

      if(!canvasProcessorRef.current) return;

      const screenShot = mediaRecorderRef.current && getStreamShot(mediaRecorderRef.current)

      //how to know the current time of the mediaReorderRef.current
  
      const imageFile = await canvasProcessorRef.current?.takeScreenShot();
  
      const url = await fileToBase64(imageFile);
  
      const name = generateScreenShotName(imageFile.name);
  
      const newScreenShot = {
        url, 
        name, 
        type: imageFile.type
      }
  
      setCapture(newScreenShot)
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150)
  
      setScreenShots(prev =>([newScreenShot, ...prev]))

    } catch (error) {
      throw error;
    }
  }

  const onCloseFullView = () => {
    setCapture(null)
  };

  const onScreenShotClick = () => {
    setCapture(screenShots[0]);
  }

  const onScreenShotRemove = (id: string) => {
    setScreenShots(shots => {
      return shots.filter(shot => shot.name !== id)
    })
  }

  //work-in-progress
  const onScreenShotSave = (id: string) => {
    const shotToSave = screenShots.find(shot => shot.name === id);
    
    //add selected shot into a database for screenshot collection in profile;
  }

  const onScreenShotSelect = (id: string) => {
    setScreenShots(shots => {
      return shots.map(shot => {
        if(shot.name === id) {
          shot = {...shot, selected: !shot.selected}
        }else {
          shot = {...shot, selected: false}
        };
        return shot;
      })
    })
  }

  useEffect(() => {
    console.log(recordingStatus);
  },[recordingStatus])

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    streamSettings,
    recordingTimer,
    handleTakeScreenShot,
    handlePauseResume,
    capture,
    onCloseFullView,
    screenShots,
    onScreenShotRemove,
    onScreenShotSave,
    onScreenShotSelect,
    onScreenShotClick,
    isFlashing
  };
};
