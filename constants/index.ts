import {v4 as uuid} from "uuid" 
import { 
  DropdownOptionsType,  
  TranscriptEntry,  
  VideoCardProps, 
  VideoConfig, 
  VideosWithPagination, 
  VideoWithUserResult, 
  Visibility
} from "..";

export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
export const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

export const BUNNY = {
  STREAM_BASE_URL: "https://video.bunnycdn.com/library",
  STORAGE_BASE_URL: "https://uk.storage.bunnycdn.com/niyo-screencast",
  CDN_URL: "https://niyo-screencast.b-cdn.net",
  EMBED_URL: "https://iframe.mediadelivery.net/embed",
  TRANSCRIPT_URL: "https://vz-509c363d-2c5.b-cdn.net",
};

export const emojis = ["😂", "😍", "👍"];

export const LOCAL_STORAGE_SCREENSHOT_TAG = "recordingScreenshots"


export const filterOptions = [
  {
    label: "Most Viewed",
    default: true
  },
  {
    label: "Most Recent",
  },
  {
    label: "Oldest First",
  },
  {
    label: "Least Viewed",
  },
];

export const visibilities: DropdownOptionsType[] = [
  {
    label: "visibility", 
    value: "public" as Visibility, 
  }, 
  {
    label: "visibility", 
    value: "private" as Visibility, 
  }
];

export const ICONS = {
  record: "/assets/icons/record.svg",
  close: "/assets/icons/close.svg",
  upload: "/assets/icons/upload.svg",
};

export const initialVideoState = {
  isLoaded: false,
  hasIncrementedView: false,
  isProcessing: true,
  processingProgress: 0,
};

export const infos = ["transcript", "metadata"];

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { ideal: 30 },
};

export const DEFAULT_EMBED_CAMERA_CONFIG: VideoConfig = {
  width: {ideal: 320},
  height: {ideal: 240},
}

export const DEFAULT_MIC_SETTINGS = {
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  sampleRate: 44100
}
  
export const DEFAULT_RECORDING_CONFIG = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
};

export const dummyVideoCardProps: Array<VideoCardProps> = [
  {
    id: "1jkewgvow34574",
    title: "ScreenCast Messaging functionality",
    thumbnailUrl: "/assets/thumbnails/img2.jpg",
    createdAt: new Date('2025-05-01'),
    userImg: "/assets/images/dummy.jpg",
    username: "Solomon",
    views: 103,
    visibility: "public",
    duration: 156,
  },
  {
    id: "2uoty3580yn09",
    title: "ScreenCast API Debugging",
    thumbnailUrl: "/assets/thumbnails/img3.jpg",
    createdAt: new Date('2025-10-13'),
    userImg: "/assets/images/dummy.jpg",
    username: "Adrian",
    views: 33,
    visibility: "public",
    duration: 131,
  },
  {
    id: "3thek763256n6jbl",
    title: "Addressing Geo-Spot UI functionality",
    thumbnailUrl: "/assets/thumbnails/img5.jpg",
    createdAt: new Date('2025-12-05'),
    userImg: "/assets/images/dummy.jpg",
    username: "Steve",
    views: 11,
    visibility: "public",
    duration: 200,
  },
  {
    id: "kk892y46kjhgfdfkj",
    title: "Addressing Geo-Spot UI functionality",
    thumbnailUrl: "/assets/thumbnails/img4.jpg",
    createdAt: new Date('2025-12-05'),
    userImg: "/assets/images/dummy.jpg",
    username: "Steve",
    views: 11,
    visibility: "public",
    duration: 200,
  },
  {
    id: "t3783745bbjkf8snba",
    title: "Addressing Geo-Spot UI functionality",
    thumbnailUrl: "/assets/thumbnails/img6.jpg",
    createdAt: new Date('2025-12-05'),
    userImg: "/assets/images/dummy.jpg",
    username: "Steve",
    views: 11,
    visibility: "public",
    duration: 200,
  },
]

export type DummyUserType = {
  id: string;
  name: string;
  image: string;
  email: string;
};

export const dummyUser = {
  id: "6523jilmkjy48jbsn",
  name: "Jose Ayomide Folarin",
  image: "/assets/images/dummy.jpg",
  email: "company@co.email.com"
}

export const dummyVideo: VideoWithUserResult = {
  video: {
    id: "tyw4j35ugj",
    videoId: "6725hbkbbn",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img1.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    visibility: "public",
    duration: 131,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser,
}

export const videoTranscript: Array<TranscriptEntry> = [
  {
    time: "21: 30",
    text: "identifiers in any context that begin with a single leading underscore (e.g. _secret)"
  },
  {
    time: "01: 45",
    text: "are intended to suggest that they are only for “internal” use to a class or module, and not part of a public interface"
  },
  {
    time: "09: 15",
    text: "identifiers in any context that begin with a single leading underscore (e.g. _secret)"
  },
  {
    time: "22: 00",
    text: "are intended to suggest that they are only for “internal” use to a class or module, and not part of a public interface"
  },
]

const dummyVideos: Array<VideoWithUserResult>  = [
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img11.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img12.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img9.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img5.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img6.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img7.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img8.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img3.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img2.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
  {video: {
    id: uuid(),
    videoId: uuid(),
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: "/assets/thumbnails/img1.jpg",
    videoUrl: '/assets/trial_video.mp4',
    userId: dummyUser.id,
    views: dummyVideoCardProps[0].views,
    tags: "trial#first#ui/ux",
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummyUser
  },
]

const dummyPagination = {
  currentPage: 1,
  totalPages: 1,
  totalItems: dummyVideos.length,
  pageSize: 10
}

export const dummyVideosWithPagination: VideosWithPagination = {
  videos: dummyVideos,
  count: dummyVideos.length,
  pagination: dummyPagination
}