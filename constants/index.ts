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
  "Most Viewed",
  "Most Recent",
  "Oldest First",
  "Least Viewed",
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
        image: "/assets/images/dummy.jpg"
    },
}
