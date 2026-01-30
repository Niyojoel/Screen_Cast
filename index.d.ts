import { ClassValue } from "clsx";
import { ReactNode } from "react";

declare interface User {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

declare interface ImgProps {
    src: string;
    alt?: string;
    size?: number;
    className?: string;
    noClass?: boolean
}

declare interface ActionButtonProps extends Omit<React.BaseHTMLAttributes, 'onClick'> {
  src?: string;
  alt?: string;
  size?: number;
  action: () => void;
  imgClassName?: string;
  noImgClass?: boolean
} 

declare interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: DropdownOptionsType[];
}

declare interface FileInputProps {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  previewUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  previewBoxRef: React.RefObject<HTMLDivElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleError: (message:string)=> void;
  onFileDrop: (e: DragEvent<HTMLElement>)=> void;
  onReset: () => void;
  type: "video" | "image";
  handleUsePreviousThumbnail?: (filename: string) => void; 
  previousThumbnails?: ImagesArrayType[],
  handleOnGenerate?: (captureTime: number, videoFile: File) => void;
  removeThumbnail?: (filename: string) => void;
}

declare interface ThumbnailSuggestionsProps {
  uploadTrigger: React.ReactNode;
  previousThumbnails: ImagesArrayType[];
  uploadTriggerClass: string;
  handleUsePreviousThumbnail: (filename: string) => void;
  removeThumbnail: (filename: string) => void;
}

declare interface ImagesConsoleProps {
  imagesArr: ImagesArrayType[];
  className?: ClassValue;
  onSelect: (id: string) => void;
  removeFn: (id: string) => void;
}

declare interface ImagesArrayType {
  base64: string | ArrayBuffer,
  fileName: string; 
  fileType: string;
} 

declare interface TranscriptEntry {
  time: string;
  text: string;
}

declare interface VideoFormValues {
  title: string;
  description: string;
  tags: string;
  visibility: "public" | "private";
}
declare interface NavbarProps {
  user: User | undefined;
}

declare interface SearchResult {
  video: {
    id: string;
    videoId: string;
    title: string;
    thumbnailUrl: string;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

declare interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  userImg: string;
  username: string;
  createdAt: Date;
  views: number;
  visibility: Visibility;
  duration: number | null;
}

declare interface VideoDetailHeaderProps {
  id: string;
  title: string;
  createdAt: Date;
  userImg: string | null | undefined;
  username?: string;
  videoId: string;
  ownerId: string;
  visibility: string;
  thumbnailUrl: string;
}

declare interface CopyBtnProps {
  id: string;
  size?: number;
  className?: string
}

declare interface VideoPlayerProps {
  id: string;
  videoId: string;
  className?: string;
}

declare interface VideoInfoProps {
  transcript?: string;
  title: string;
  createdAt: Date;
  description: string;
  videoId: string;
  videoUrl: string;
}

declare interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  fallback?: string;
  alt: string;
  src: string | null;
}

type Visibility = "public" | "private";

declare interface VideoDetails {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  // tags: string | string[] | undefined;
  tags: string | undefined;
  visibility: Visibility;
  duration?: number | null;
}

declare type DeleteContentStructProps = {
  icon: React.ReactNode,
  headerText: string,
  subText: string
}


declare interface BunnyVideoResponse {
  guid: string;
  status: number;
  encodeProgress?: number;
}

declare type ApiResponse<T> =
  | ({ success: true; error: null } & T)
  | { success: false; error: string };

declare interface ApiFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  expectJson?: boolean;
  bunnyType: "stream" | "storage";
}

declare interface BunnyStreamApiOptions {
  method?: string;
  body?: object;
}

declare interface VideoUploadUrlResponse {
  videoId: string;
  uploadUrl: string;
  accessKey: string;
}

declare interface ThumbnailUploadUrlResponse {
  uploadUrl: string;
  cdnUrl: string;
  accessKey: string;
}

declare interface VideoProcessingStatus {
  isProcessed: boolean;
  encodingProgress: number;
  status: number;
}

declare interface VideoWithUserResult {
  video: {
    id: string;
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    userId: string;
    views: number;
    tags: string[];
    duration: number;
    visibility: Visibility;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

declare interface VideoObject {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  userId: string;
  views: number;
  duration: number;
  tags: string[];
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

declare interface UserWithVideos {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  };
  videos: VideoObject[];
  count: number;
}

declare interface ExtendedMediaStream extends MediaStream {
  _originalStreams?: MediaStream[];
}

declare interface SharedHeaderProps {
  subHeader: string;
  title: string;
  userImg?: string;
}

declare interface SharedHeaderProps {
  subHeader: string;
  title: string;
  userImg?: string;
}

declare interface Params {
  params: Promise<Record<string, string>>;
}

declare interface SearchParams {
  searchParams: Promise<Record<string, string | undefined>>;
}

declare interface ParamsWithSearch {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | undefined>>;
}

declare type ModalOpenType = {
  isOpen: boolean;
  type: ModalType | null;
  closeIcon?: React.ReactNode
}

declare type ModalContentType = {
  body: React.ReactElement,
  buttons?: ModalButton[]
}

declare interface ModalProps {
  closeModal: () => void,
  closeIcon: React.ReactNode,
  error: string,
  setError: (message: string) => void,
  footerButtons?: ModalButton[] | null, 
  contentBody: React.ReactNode
}

declare interface DialogBodyContentProps {
  icon?: React.ReactNode, 
  headerNode?: string | React.ReactElement, 
  subNode?: string | React.ReactElement, 
  className?: string,
  actionPopup?: boolean
}

declare interface DialogContentListFeatureProps {
  featureName: string, 
  featureStatus: string,
  className?: string
}

declare type ModalButton = {
  className: string;
  action: () => void;
  text: string;
  icon?: React.ReactNode;
}

declare type DropdownOptionsType = {
  label: string,
  icon?: React.ReactNode,
  value?: string,
  default?: boolean,
  inactive?: boolean,
  placeholder?: boolean,
}

declare type SelectOptionType = {
  label: string,
  value: Visibility,
  placeholder?: boolean,
} 

declare type OptionsTriggerProps = {
  activeOption: DropdownOptionsType,
  triggerIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

declare interface DropdownListProps {
  options: DropdownOptionsType[];
  onSelectAction: (option: DropdownOptionsType) => void;
  activeOption: DropdownOptionsType,
  className?: string;
  triggerIcon?: React.ReactNode;
  triggerClass?: string;
  disabled?: boolean;
};

declare interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

declare interface MediaStreams {
  displayStream: MediaStream | null;
  userMediaStream: MediaStream | null;
  hasDisplayAudio: boolean;
}

type CursorOptions = "always" | "motion" | 'never'

type DisplaySurfaceOptions = "monitor" | "window" | "browser" | 'camera only'

type CameraOptions = "no" | "with" | 'only'

type BrowserDialogOptionsType = 'Entire Screen' | 'Window' | 'Browser Tab'

type CameraFacingMode = 'user' | 'environment'

type DeviceType =  "camera" | "microphone"

type PermissionsType = "denied" | "granted" | "prompt"

type DeviceStatus = "passed" | "no-permission" | 'no-support' | "unchecked" | 'unused'


type ModalType = 'record' | 'upload' | 'post';

type ParentContentType = 'record' | 'generate' 

type RecordAction = 'check' | 'record' | 'load' | 'redirect' | 'save_record'

type UploadAction = GenerateAction | 'edit'

type GenerateAction =  'generate' | 'add_to_video' | 'save_thumbnail' 

type PostAction = 'delete' | 'download'

type Action = RecordAction | UploadAction | PostAction;

type ActionStateType = 'before' | 'ongoing' | 'after'

type ActionResponseType = 'failed' | 'successful'

declare type BeforeModalActionType = {
  name: Action | '';
  state: ActionStateType | null;
  response: ActionResponseType | null;
}

declare type OngoingModalActionType = {
  name: Action | '';
  state: Omit<ActionStateType, 'before'> | null;
  response: ActionResponseType | null;
}

declare type OpenModalArgs = {
  type: ModalType;
  closeIcon?: React.ReactNode
}

declare type VideoSettingsType = {
  cursor: CursorOptions;
  displaySurface: DisplaySurfaceOptions;
  camera: CameraOptions;
  cameraFacingMode: CameraFacingMode;
  withMic: boolean;
}

declare type RecordingDialogContentBodyProps = {
  modalParentContent: ActionStatusType | null,
  recordedVideoUrl: string,
  goToUpload: GoToUploadState | null,
  videoRef: RefObject<HTMLVideoElement | null>,
  settingsGuide : string,
  showInstructions : boolean,
  videoSettings : VideoSettingsType,
  selectedVideoSetting : VideoSettingsType & {systemAudio: boolean},
  recordSettings: RecordSettingsType[],
  actionResponse: "failed" | "successful" | null;
}

declare interface RecordSettingsType {
  options: DropdownOptionsType[];
  title?: string,
  updateSetting: (option: string) => void;
  className?: string,
  settingValue: [
    keyof VideoSettingsType, 
    VideoSettingsType[keyof VideoSettingsType]
  ],
  idIcon?: React.ReactNode,
  disabled?: boolean,
}

declare interface BunnyRecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordedVideoUrl: string;
  recordingDuration: number;
}

declare interface ExtendedMediaStream extends MediaStream {
  _originalStreams?: MediaStream[];
}

// Types
interface VideoQueryResult {
  video: typeof videos.$inferSelect;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number | unknown;
  };
}

declare interface RecordingHandlers {
  onDataAvailable: (e: BlobEvent) => void;
  onStop: () => void;
}

type size = {ideal: number};

declare type VideoConfig = {
  width: size,
  height: size,
  frameRate?: size,
  facingMode?: string
}  