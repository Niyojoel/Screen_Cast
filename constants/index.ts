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

export const filterOptions = [
  {
    label: "Most Viewed",
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

export const visibilities: Visibility[] = ["public", "private"];

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

export const DEFAULT_VIDEO_CONFIG = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { ideal: 30 },
};

export const DEFAULT_RECORDING_CONFIG = {
  mimeType: "video/webm;codecs=vp9,opus",
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


export const dummySession = {
    user:{
        id: "6523jilmkjy48jbsn",
        name: "Jose Ayomide Folarin",
        image: "/assets/images/dummy.jpg",
        email: "company@co.email.com"
    },
}

export const dummyVideo: UserWithVideos = {
    videos: [
      {
        id: "tyw4j35ugj",
        videoId: "6725hbkbbn",
        title: "Trial Video for Content Management",
        description: 'First video to be shown for offline video page testing and user interface adjustment',
        thumbnailUrl: dummyVideoCardProps[0].thumbnailUrl,
        videoUrl: '/assets/trial_video.mp4',
        userId: dummySession.user.id,
        views: dummyVideoCardProps[0].views,
        tags: ["trial", "first", "ui/ux"],
        visibility: "public",
        duration: 131,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    }
  ],
  user: dummySession.user,
  count: 1
}

export const dummyVideos: VideoWithUserResult[]  = [
  {video: {
    id: "tyw4j35ugjyu",
    videoId: "6725hbkbbnty",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[0].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j35gje5u5",
    videoId: "6725hbkdmyj",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[1].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j34hdgj",
    videoId: "6725fndfn5e",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[2].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j35yuy36u",
    videoId: "6725hh54y5yj",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[3].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j387iki",
    videoId: "6725h3u7ykr",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[4].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j373257e",
    videoId: "6725hb1g4t3q",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[0].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j3g134g",
    videoId: "6725hbkbiuoy",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[0].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
  {video: {
    id: "tyw4j35ugj86pmm",
    videoId: "6725hbkbbcxzvn",
    title: "Trial Video for Content Management",
    description: 'First video to be shown for offline video page testing and user interface adjustment',
    thumbnailUrl: dummyVideoCardProps[0].thumbnailUrl,
    videoUrl: '/assets/trial_video.mp4',
    userId: dummySession.user.id,
    views: dummyVideoCardProps[0].views,
    tags: ["trial", "first", "ui/ux"],
    duration: 131,
    visibility: "public",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  user: dummySession.user
  },
]