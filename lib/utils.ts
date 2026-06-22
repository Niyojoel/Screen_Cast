import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ilike, or, sql } from "drizzle-orm";
import { videos } from "@/drizzle/schema";
import { 
  DEFAULT_VIDEO_CONFIG, 
  DEFAULT_RECORDING_CONFIG, 
  DEFAULT_EMBED_CAMERA_CONFIG, 
  DEFAULT_MIC_SETTINGS, 
  LOCAL_STORAGE_SCREENSHOT_TAG
} from "@/constants";
import { 
  BrowserDialogOptionsType, 
  CameraFacingMode, 
  CameraOptions, 
  CanvasDisplay, 
  CanvasProcessor, 
  CursorOptions, 
  DeviceStatus, 
  DeviceType, 
  DisplaySurfaceOptions, 
  ImagesArrayType, 
  MediaStreams, 
  PermissionsType, 
  RecordingHandlers, 
  TranscriptEntry, 
  VideoConfig, 
  VideoDisplay, 
  VideoSettingsType 
} from "..";
import { SyncCameraKeys } from "./hooks/useRecord/useModalActions";
import { ChangeEvent, Ref, RefObject } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadFileToBunny = async (file: File, uploadUrl: string, accessKey: string): Promise<void> => {
  return await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      'Content-Type': file.type,
      AccessKey: accessKey
    },
    body: file
  }).then(response => {if(!response.ok) throw new Error('Upload failed')})
}

export const updateURLParams = (
  currentParams: URLSearchParams,
  updates: Record<string, string | null | undefined>,
  basePath: string = "/"
): string => {
  const params = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([name, value]) => {
    if(value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
  })
  return `${basePath}?${params.toString()}`
};

// Get env helper function
export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env: ${key}`);
  return value;
};

// API fetch helper with required Bunny CDN options
export const apiFetch = async <T = Record<string, unknown>>(
  url: string,
  options: Omit<ApiFetchOptions, "bunnyType"> & {
    bunnyType: "stream" | "storage";
  }
): Promise<T> => {
  const {
    method = "GET",
    headers = {},
    body,
    expectJson = true,
    bunnyType,
  } = options;

  const key = getEnv(
    bunnyType === "stream"
      ? "BUNNY_STREAM_ACCESS_KEY"
      : "BUNNY_STORAGE_ACCESS_KEY"
  );

  const requestHeaders = {
    ...headers,
    AccessKey: key,
    ...(bunnyType === "stream" && {
      accept: "application/json",
      ...(body && { "content-type": "application/json" }),
    }),
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`API error ${response.text()}`);
  }

  if (method === "DELETE" || !expectJson) {
    return true as T;
  }

  return await response.json();
};
// Higher order function to on errors
export const withErrorHandling = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>
) => {
  return async (...args: A): Promise<T> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return errorMessage as unknown as T;
    }
  };
};

export const getOrderByClause = (filter?: string) => {
  switch (filter) {
    case "Most Viewed":
      return sql`${videos.views} DESC`;
    case "Least Viewed":
      return sql`${videos.views} ASC`;
    case "Oldest First":
      return sql`${videos.createdAt} ASC`;
    case "Most Recent":
    default:
      return sql`${videos.createdAt} DESC`;
  }
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  //if pages is not more than 7
  if(totalPages <= 7) {
    return Array.from({length : totalPages}, (_, i) => i + 1)
  }

  //if current page is near the starting page, maybe 3
  if(currentPage <= 3) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  //if current page is near the last page, maybe 5
  if(currentPage >= totalPages - 2) {
    return [
      1, 
      "...", 
      totalPages - 4, 
      totalPages - 3, 
      totalPages - 2, 
      totalPages - 1, 
      totalPages
    ]
  }
  //if current page is somewhere in the middle of the total pages
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages
  ]
};

export const parseVideoSettings = (
  key: keyof VideoSettingsType, 
  option: string
): VideoSettingsType[keyof VideoSettingsType] => {

  let parsedValue: VideoSettingsType[keyof VideoSettingsType] = false;
  
  if(key === "displaySurface") {
    parsedValue = parseHintedDisplaySetting(option);
  } else if (key === 'camera') {
    parsedValue = parseSelectedCam(option);
  } else if (key === "cameraFacingMode") {
    parsedValue = parseCameraFacingMode(option as 'Front' | 'Back');
  } else if (key === "cursor") {
    parsedValue = parseCursorSetting(option);
  } else if (key === "withMic") {
    parsedValue = parseSelectedMic(option)
  }
  return parsedValue;
}

export const parseCameraFacingMode = (selectedMode: "Front" | "Back"): CameraFacingMode => {
  switch (selectedMode.toLowerCase()) {
    case "back":
      return 'environment';
    default:
      return 'user'
  }
}

export const parseSelectedMic = (selectedMic: string): boolean => {
  switch (selectedMic.toLowerCase()) {
    case "no microphone":
      return false;
    default:
      return true
  }
}

export const parseSelectedCam = (selectedCam: string): CameraOptions => {
  switch (selectedCam.toLowerCase()) {
    case "no camera":
      return "no";
    case "with camera":
      return "with";
    case "camera only":
      return "only";
    default:
      throw new Error('unknown option provided');
  }
}

export const parseOutputDisplaySetting = (displaySetting: DisplaySurfaceOptions): string => {
  switch (displaySetting.toLowerCase()) {
    case "monitor":
      return "Entire Screen";
    case "window":
      return "Window";
    case "browser":
      return "Browser Tab";
    case "camera only":
      return "Camera Only";
    default:
      throw new Error('unknown option provided');
  }
}

export const parseBrowserDialogOptions = (option: DisplaySurfaceOptions): BrowserDialogOptionsType => {
  switch (option.toLowerCase()) {
    case "monitor":
      return "Entire Screen";
    case "window":
      return "Window";
    case "browser":
      return "Browser Tab";
    default:
      throw new Error('unknown option provided');
  }
}

export const parseHintedDisplaySetting = (selectedSetting: string): DisplaySurfaceOptions => {
  switch (selectedSetting.toLowerCase()) {
    case "entire screen":
      return "monitor";
    case "window":
      return "window";
    case "browser tab":
      return "browser";
    case "camera only":
      return "camera only";
    default:
      throw new Error('unknown option provided');
  }
}

export const parseCursorSetting = (cursorSetting: string): CursorOptions => {
  switch (cursorSetting.toLowerCase()) {
    case "show always":
      return "always";
    case "hide cursor":
      return "never";
    case "show in motion":
      return "motion";
    default:
      throw new Error('unknown option provided');
  }
}

export const syncCameraOnly = async(
  key: keyof SyncCameraKeys, 
  value: DisplaySurfaceOptions | CameraOptions,
  videoSettings: SyncCameraKeys
): Promise<[keyof VideoSettingsType, VideoSettingsType[keyof VideoSettingsType]] | null> => {
  let syncSetting: [keyof VideoSettingsType, VideoSettingsType[keyof VideoSettingsType]] | null = null;
  if(key === 'displaySurface' 
  && value === 'camera only') {
    syncSetting = ['camera', 'only']
  } else if (key === 'displaySurface' 
  && value !== 'camera only' 
  && videoSettings.camera === "only") {
    syncSetting = ['camera', 'no']
  } else if (key === 'camera' 
  && value === 'only') {
    syncSetting = ['displaySurface', 'camera only']
  } else if (key === 'camera' 
  && value !== 'only' 
  && videoSettings.displaySurface === "camera only") {
    syncSetting = ["displaySurface", "monitor"]
  }
  return syncSetting;
}

const checkHardwareSupport = async(device: DeviceType): Promise<boolean> => {
  const devices = await navigator.mediaDevices.enumerateDevices();

  const hasDevice = devices.some(d => {
    if(device === "camera") return d.kind === "videoinput";
    return d.kind === "audioinput";
  })

  if(!hasDevice) return false;

  return true;
}

const checkPermission = async (device: DeviceType): Promise<PermissionsType | null> => {
  try {
    const permissionStatus = await navigator.permissions.query({name: device as any});
    console.log(`${device} state: ${permissionStatus.state}`);

    return permissionStatus.state;
    
  } catch (error) {
    console.error('Permissions API not supported for this device in this browser.')
    return null;
  }
}

export const checkDevice = async (device: DeviceType): Promise<DeviceStatus> => {
  const supported = await checkHardwareSupport(device);

  console.log({[device]: supported})

  if(!supported) return 'no-support';
  
  const permissionStatus = await checkPermission(device);
  
  console.log(permissionStatus)
  
  if(permissionStatus !== "granted") return 'no-permission';

  console.log(`setting ${device} to pass`)

  return 'passed'
}

//helper
const getCameraConfig = async (
  use: CameraOptions, 
  mode?: CameraFacingMode
): Promise<VideoConfig>  => {
  let config: VideoConfig | null = null;
  
  if(use === 'with' ) {
    config = DEFAULT_EMBED_CAMERA_CONFIG;
  } else {
    config = {
      ...DEFAULT_VIDEO_CONFIG,
      facingMode: mode
    }
  }
  return config;
}

//helper
const getUserMediaSettings = async (
  camera: CameraOptions, 
  mode: CameraFacingMode, 
  withMic: boolean
): Promise<MediaStreamConstraints | undefined> => {

  let userMediaSettings: MediaStreamConstraints | undefined = undefined;

  if(camera !== 'no') {
    userMediaSettings = {
      video: await getCameraConfig(camera, mode),
      audio: DEFAULT_MIC_SETTINGS,
    }
  }else if (withMic) {
    userMediaSettings = {
      audio: DEFAULT_MIC_SETTINGS,
    }
  }

  return userMediaSettings; 
}

export const getMediaStreams = async (
  videoSettings: VideoSettingsType
): Promise<MediaStreams> => {

  const {
    camera, 
    cameraFacingMode: mode, 
    withMic, 
    displaySurface, 
    cursor
  } = videoSettings;

  let displayStream: MediaStream | null = null;
  let userMediaStream: MediaStream | null = null;
  let hasDisplayAudio: boolean = false;

  const userMediaConstraints = await getUserMediaSettings(camera, mode, withMic)

  
  const displayMediaConstraints = {
    video: {
      ...DEFAULT_VIDEO_CONFIG, 
      displaySurface, 
      cursor
    },
    audio: true,
  }
  
  if(displaySurface !== "camera only") {
    displayStream = await navigator.mediaDevices.getDisplayMedia(displayMediaConstraints);
  }

  if(userMediaConstraints) {
    userMediaStream = await navigator.mediaDevices.getUserMedia(userMediaConstraints);
  }else null;

  if(displayStream) {
    hasDisplayAudio = displayStream.getAudioTracks().length > 0;
  }

  if(userMediaStream) {
    userMediaStream
    .getAudioTracks()
    .forEach((track: MediaStreamTrack) => (track.enabled = true))
  };
    
  return {displayStream, userMediaStream, hasDisplayAudio};
};

export const killMediaStreams = (streams: (MediaStream | null)[]) => {
  streams?.forEach(stream => {
    stream?.getTracks().forEach(track => {
      track.stop()
      track.enabled = false;
    })
  })
}

const getVideoDisplay = async (src: MediaStream | File): Promise<VideoDisplay>  => {

  const video = document.createElement('video');

  let width: number | undefined = undefined;
  let height: number | undefined = undefined;

  if(src instanceof MediaStream) {
    video.srcObject = src;
    await video.play();
    const dimensn = getTrackSetting(src);
    width = dimensn.width; 
    height = dimensn.height
  }else {
    video.src = URL.createObjectURL(src);
    video.crossOrigin ="anonymous";
    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => {
        resolve()
      }
    })

    width = video.videoWidth
    height = video.videoHeight
  }

  return {video, width, height};
}

const getCanvasDisplay = async ({video, width, height}: VideoDisplay,
predefined_canvas?: HTMLCanvasElement
): Promise<CanvasDisplay> => {
  const canvas = predefined_canvas || document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    alpha: false,
    willReadFrequently: false
  }); 

  if(!predefined_canvas) {
    canvas.width = width || video.videoWidth || 1920;
    canvas.height = height || video.videoHeight || 1080;
  }

  if(!ctx) throw new Error ('Could not get canvas context');
  
  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

  return {ctx, canvas};
}

export const getVideoProcessor = async (screenStream: MediaStream): Promise<Omit<CanvasProcessor, 'stopLoop' | 'stream'>> => {

  if(screenStream.getVideoTracks().length < 1) throw new Error ('No video available for display')

  const screenDisplay = await getVideoDisplay(screenStream);

  const takeScreenShot = async () => {
    const {ctx, canvas} = await getCanvasDisplay({video: screenDisplay.video});
    return await canvasToBlob(canvas, 'image/png')
  }

  const end = () => {
    screenDisplay.video.pause();
    screenDisplay.video.srcObject = null;
    screenDisplay.video.remove();
  }

  return {
    pause: () => {screenDisplay.video.pause()}, 
    resume: () => {screenDisplay.video.play()}, 
    takeScreenShot,
    end
  }; 
} 

export const getCanvasProcessor = async (
  screenStream: MediaStream, 
  cameraStream?: MediaStream,
  withCamera_?: boolean,
): Promise<CanvasProcessor> => {
  const FPS = 30;
  let intervalId : NodeJS.Timeout | null = null;
  let isPaused = false;
  
  let predefined_canvas = document.createElement('canvas');
  
  if(screenStream.getVideoTracks().length < 1) throw new Error ('No video available for display')

  const withCamera = withCamera_ && cameraStream && cameraStream?.getVideoTracks().length > 0;

  const screenDisplay = await getVideoDisplay(screenStream);
  const cameraDisplay = withCamera && await getVideoDisplay(cameraStream);

  predefined_canvas.width = screenDisplay.width || 3840;
  predefined_canvas.height = screenDisplay.height || 2160;

  const startLoop = () => {
    intervalId = setInterval(async ()=> {
      if(!isPaused && screenDisplay.video.readyState >= 2) {

        const {ctx, canvas} = await getCanvasDisplay({video: screenDisplay.video}, predefined_canvas);

        //might not work right
        predefined_canvas = canvas;

        if(cameraDisplay) {
          const camWidth = cameraDisplay.width || 320;
          const camHeight = cameraDisplay.height || 240;
          const padding= 20;
          
          ctx?.drawImage(
            cameraDisplay.video,
            canvas.width - camWidth - padding,
            canvas.height - camHeight - padding,
            camWidth,
            camHeight
          );
        }
      }
    }, 1000 / FPS);
    return () => clearInterval(intervalId as NodeJS.Timeout);
  }

  startLoop();

  //might have to move them all inside startLoop

  const stopLoop = (): void => {
    if(intervalId) {
      clearInterval(intervalId as NodeJS.Timeout)
      intervalId = null;
      console.log('canvas interval cleared')
    }
  };

  const stream = predefined_canvas.captureStream(FPS);

  const takeScreenShot = async () => {
    return await canvasToBlob(predefined_canvas, 'image/png');
  }

  const clearVideo = (video: HTMLVideoElement) => {
    video.pause();
    video.srcObject = null;
  }

  const end = () => {
    stopLoop();
    clearVideo(screenDisplay.video);
    if(cameraDisplay) clearVideo(cameraDisplay.video);
    predefined_canvas.remove();
  }

  return {
    stream, 
    pause: () => {isPaused = true}, 
    resume: () => {isPaused = false}, 
    takeScreenShot,
    stopLoop, 
    end
  };
}

export const getTrackSetting = (stream: MediaStream) => {
  const videoTrack: MediaStreamTrack = stream.getVideoTracks()[0]; 
  const setting: MediaTrackSettings = videoTrack.getSettings();
  return setting;
}

export const addTrack = async (
  stream: MediaStream, 
  combinedStream: MediaStream, 
  trackType: "video" | "audio" | "both"
): Promise<void> => {
  let track: MediaStreamTrack[] | null = null;

  if(trackType === 'video') {
    track = stream.getVideoTracks()
  }else if (trackType === 'audio') {
    track = stream.getAudioTracks()
  }else {
    track = stream.getTracks()
  }

  if(!track) {
    throw new Error('No track to add to the combined stream');
  }

  track.forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));
}

export const createAudioMixer = async (
  ctx: AudioContext,
  displayStream: MediaStream,
  userMediaStream: MediaStream | null,
  hasDisplayAudio: boolean
): Promise<MediaStreamAudioDestinationNode | null> => {
  if (!hasDisplayAudio && !userMediaStream) {
      console.log("No audio track in this streams");
      alert('No audio track in this stream');
      return null;
  };

  console.log({
    displayAudio: displayStream.getAudioTracks().length,
    userAudio: userMediaStream && userMediaStream.getAudioTracks().length
  })

  if(ctx.state === "suspended") {
    await ctx.resume();
  }

  const destination = ctx.createMediaStreamDestination();
  const mix = (stream: MediaStream, gainValue: number) => {
    if(!stream || stream.getAudioTracks().length === 0) return;
    const source = ctx.createMediaStreamSource(stream);
    const gain = ctx.createGain();
    gain.gain.value = gainValue;
    source.connect(gain).connect(destination);
  };

  if (hasDisplayAudio) mix(displayStream, 0.7);
  if (userMediaStream) mix(userMediaStream, 1.5);

  return destination;
};

export const setupMediaRecorder = (stream: MediaStream) => {
  try {
    return new MediaRecorder(stream, DEFAULT_RECORDING_CONFIG);
  } catch {
    return new MediaRecorder(stream);
  }
};

export const getVideoDuration = (url: string): Promise<number | null> =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration =
        isFinite(video.duration) && video.duration > 0
          ? Math.round(video.duration)
          : null;
      URL.revokeObjectURL(video.src);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };
    video.src = url;
  });

export const streamMonitor = async (stream: MediaStream): Promise<string> => {
  const hasVideo = stream.getVideoTracks().some(t => t.enabled)
  const hasAudio = stream.getAudioTracks().some(t => t.enabled)

  return hasAudio && hasVideo ? "both audio & video ok" : 'only one enabled' 
};

//helper
const getRecorderConfig = (stream: MediaStream) => {

  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/mp4',
  ];

  let mimeType: string = "";

  if(stream.getAudioTracks().length > 0){
    mimeType = types.find(type => MediaRecorder.isTypeSupported(type)) || ''
  }

  if(!mimeType) console.log("No supported mime type. Using a fallback type")

  return {
    ...DEFAULT_RECORDING_CONFIG,
    mimeType: mimeType ? mimeType : 'video/webm;codecs=vp8,opus'
  }
} 
  
export const setupRecording = (
  stream: MediaStream,
  onrs: RecordingHandlers
): MediaRecorder => {
  const recorder = new MediaRecorder(stream, getRecorderConfig(stream));
  recorder.ondataavailable = onrs.onDataAvailable;
  recorder.onstop = onrs.onStop;
  return recorder;
};

export const cleanupRecording = (
  recorder: MediaRecorder | null,
  stream: MediaStream | null,
  originalStreams: MediaStream[] = [],
  endCanvasProcessor: () => void | null
) => {
  try {
    if (recorder?.state !== "inactive") {
      recorder?.stop();
    }
  } catch (error) {
    console.log('Failed to stop recorder: ', error);
  }

  if(endCanvasProcessor) {
    endCanvasProcessor();
  };

  console.log('cleaning up tracks')
  
  stream?.getTracks().forEach((track: MediaStreamTrack) =>{ 
    track.stop()
    console.log("Stopped combined track: ", track.kind)
  });
  originalStreams.forEach((s) =>
    s.getTracks().forEach((track: MediaStreamTrack) => track.stop())
  );
};

export const createRecordingBlob = (
  chunks: Blob[]
): { blob: Blob; url: string } => {
  const blob = new Blob(chunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  return { blob, url };
};

export const calculateRecordingDuration = (startTime: number | null): number =>
  startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

export const generateThumbnail = (captureTime: number = 2, videoFile: File): Promise<File> => {
  return new Promise ( async (resolve, reject) => {

    if(!(videoFile instanceof File)) throw new Error('The video file is invalid')

    const videoDisplay = await getVideoDisplay(videoFile)

    const {video} = videoDisplay;
    
    video.onloadeddata = () => {
      video.currentTime = Math.min(captureTime, video.duration);
    }

    video.onseeked = async () => {
      const {canvas} = await getCanvasDisplay(videoDisplay);

      try {
        const imageFile = await canvasToBlob(canvas);
        URL.revokeObjectURL(video.src);
        if(imageFile) resolve(imageFile);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      throw new Error('failed to load video');
    }
  })
}

export const canvasToBlob = (canvas: HTMLCanvasElement, fileType?: string): Promise<File> => {
  return new Promise ((resolve, reject) => {
    canvas.toBlob(blob => {
      if(blob) {
        const imageUrl = URL.createObjectURL(blob);
        const imageName = imageUrl.split('/')[0];
        const imageFile = new File([blob], imageName, {type: blob.type});

        resolve(imageFile);
      }else {
        reject (new Error('Failed to create blob'));
      }
    }, fileType || 'image/png', 1)
  })
}

export const downloadVideo = async (videoUrl: string) : Promise<boolean> => {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
  
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/')[0];
    document.body.appendChild(a);
    a.click();
  
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return true;
  }catch (error) {
    console.error(error)
    throw error
  }
}

export function parseTranscript(transcript: string): TranscriptEntry[] {
  const lines = transcript.replace(/^WEBVTT\s*/, "").split("\n");
  const result: TranscriptEntry[] = [];
  let tempText: string[] = [];
  let startTime: string | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const timeMatch = trimmedLine.match(
      /(\d{2}:\d{2}:\d{2})\.\d{3}\s-->\s(\d{2}:\d{2}:\d{2})\.\d{3}/
    );

    if (timeMatch) {
      if (tempText.length > 0 && startTime) {
        result.push({ time: startTime, text: tempText.join(" ") });
        tempText = [];
      }
      startTime = timeMatch[1] ?? null;
    } else if (trimmedLine) {
      tempText.push(trimmedLine);
    }

    if (tempText.length >= 3 && startTime) {
      result.push({ time: startTime, text: tempText.join(" ") });
      tempText = [];
      startTime = null;
    }
  }

  if (tempText.length > 0 && startTime) {
    result.push({ time: startTime, text: tempText.join(" ") });
  }

  return result;
}

export function daysAgo(inputDate: Date): string {
  const input = new Date(inputDate);
  const now = new Date();

  const diffTime = now.getTime() - input.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else {
    return `${diffDays} days ago`;
  }
}

export const createIframeLink = (videoId: string) =>
  `https://iframe.mediadelivery.net/embed/${getEnv('BUNNY_LIBRARY_ID')}/${videoId}?autoplay=true&preload=true`;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const doesTitleOrTagMatch = (videos: any, searchQuery: string) =>
  or(ilike(
    sql`REPLACE(REPLACE(REPLACE(LOWER(${videos.title}), '-', ''), '.', ''), ' ', '')`,
    `%${searchQuery.replace(/[-. ]/g, "").toLowerCase()}%`
  ),
  ilike(
    sql`REPLACE(REPLACE(LOWER(${videos.tags}), '#', ''), ' ', '')`,
    `%${searchQuery.replace(/[-. ]/g, "").toLowerCase()}%`
  )
);

export const formValues = (formField: Record<PropertyKey, string>): Record<string, string> => {
  let addedValue:Record<string, string>  = {};
  Object.entries(formField).forEach(([name, value]) => {
    if(value) {
      addedValue[name] = value;
    }
  });
  return addedValue;
};

export const base64ToFile = async ({url, name,type}: ImagesArrayType): Promise<File> => {
  const response = await fetch(url as string);

  if(!response.ok) throw new Error(`Failed to fetch ${response.status} ${response.statusText}`);

  const blob = await response.blob();

  return new File([blob], name, {type: type})
}

export const base64ToUrl = async function (base64: string): Promise<string> { 
  const blob = await fetch(base64).then(res => res.blob());
  return URL.createObjectURL(blob);
};

export const fileToBase64 = (file: File): Promise<string | ArrayBuffer> => {
  return new Promise ((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result;
        if(base64) {
          resolve(base64)
        } else {
          new Error('failed to turn file to base64');
        };
      }
      reader.readAsDataURL(file);
    } catch(error) {
      reject(error);
    }
  })
}

export const generateScreenShotName = () => {

  const name = 'screenshot';

  const now = new Date();
  
  const date = now.toISOString().split('T')[0];

  const withAppend = (time : number) => time.toString().padStart(2, '0')
  const time = withAppend(now.getHours()) + '-' + withAppend(now.getMinutes()) + '-' + withAppend(now.getSeconds());

  return `${name}_${date}_${time}`
}

export const formatTimer = (time: number) => {
  return time < 10 ? `0${time}` : `${time}`;
} 

type inputChangeArgs = {
  inputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const fileLoad = (
  onFileChange: (file: File) => void,
  file: File
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      onFileChange(file);
      resolve(true);
    } catch (error) {
      console.error(error);
      resolve(false);
    }
  })
}

export const inputChange = <T extends inputChangeArgs> (
  type: T,
  file: File
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if(type.inputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        type.inputRef.current.files = dataTransfer.files;
    
        const event = new Event('change', {bubbles: true});
    
        type.inputRef.current.dispatchEvent(event);
        type.onFileChange({
          target: {files: dataTransfer.files}
        } as ChangeEvent<HTMLInputElement>)
  
        resolve(true);
      }
    } catch (error) {
      console.error(error);
      resolve(false);
    }

  })
}

export function getLSShots () : Array<ImagesArrayType> | null {
  const savedShotsUnParsed = localStorage.getItem(LOCAL_STORAGE_SCREENSHOT_TAG)

  if(savedShotsUnParsed == null || savedShotsUnParsed == undefined) {
    return null
  }

  return JSON.parse(savedShotsUnParsed)
}

export function saveLSShots(shots: ImagesArrayType[]) {
  localStorage.setItem(LOCAL_STORAGE_SCREENSHOT_TAG, JSON.stringify(shots))
}

export function deleteShotFromLS (id: string) {
  const lsSavedShots = getLSShots()

  if(lsSavedShots !== null) {
    const foundShot = lsSavedShots.find(shot => shot.name == id)

    if(foundShot?.name) {
      saveLSShots(lsSavedShots.filter((shot) => shot.name !== id))
    }
  }
}