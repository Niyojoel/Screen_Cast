import { SearchParams } from '@/index';
import { ClassValue } from "clsx";
import { ReactNode } from "react";
import { RecordingTimerType } from "./lib/hooks/useRecordingFeatures";
import { ActionType, NoNameModalActionType, VoidAction, VoidActionParamsOptional } from "./lib/hooks/useModalContext";
import { string } from "better-auth";

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
  type: "video" | "image";
  file: File | null;
  previewUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  previewBoxRef: React.RefObject<HTMLDivElement | null>;
  onChange: (file: File) => void;
  onReset: VoidActon;
  onOpenModal?: (action: 'generate' | 'edit', parent?: 'thumbnail') => void;
  fileChangeError: string;
  logError: (log: string) => void;
  previousThumbnails?: ImagesArrayType[],
  removeThumbnail?: (filename: string) => void;
}

declare type UploadTriggerProps = {
  text: string;
  className?: Record<string, boolean>
}

declare interface ThumbnailSuggestionsProps {
  uploadTrigger: React.ReactNode;
  previousThumbnails: ImagesArrayType[];
  uploadTriggerClass: string;
  onChange: (file: File) => void;
  removeThumbnail: (filename: string) => void;
}

declare interface ImagesConsoleProps {
  imagesArr: ImagesArrayType[];
  className?: ClassValue;
  cardClass?: ClassValue;
  btnsClass?: string;
  buttonSize?: number;
  onRemove?: (id: string) => void;
  onClick: (id: string) => void;
}

declare interface ImagesArrayType {
  url: string | ArrayBuffer;
  name: string; 
  type: string;
  selected?: boolean;
} 

declare interface CanvasProcessor {
  stream: MediaStream; 
  stopLoop: VoidActon; 
  pause: VoidActon;
  resume: VoidActon;
  takeScreenShot: () => Promise<File>;
  end: VoidActon
}

declare interface VideoDisplay {
  video: HTMLVideoElement, 
  width?: number | undefined, 
  height?: number | undefined
}

declare interface CanvasDisplay {
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement
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

declare type SessionUserType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
}

declare type DBUserType = {
  id: string;
  name: string;
  image: string | null;
  email: string;
};

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
    tags: string | null;
    duration: number;
    visibility: Visibility;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string;
    image: string | null;
  } | null;
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
  tags: string | null;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

declare interface VideosWithPagination {
  videos: VideoWithUserResult[];
  count: number;
  pagination: PaginationValuesType
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

declare type SearchParamsObj = {
  filter: string,
  search: string | undefined,
  pageNumber?: number,
  pageSize?: number
}

declare interface SearchParams {
  searchParams: Promise<SearchParamsObj>
}

declare interface ParamsWithSearch {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{
    filter: string,
    search: string | undefined,
    pageNumber?: number,
    pageSize?: number
  }>;
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
  closeModal: VoidActon,
  closeIcon: React.ReactNode,
  error: string,
  setError: (message: string) => void,
  footerButtons?: ModalButton[] | null, 
  contentBody: React.ReactNode
}
declare interface ModalBodyProps {
  icon?: React.ReactNode, 
  headerNode?: string | React.ReactElement, 
  subNode?: string | React.ReactElement, 
  className?: string,
  actionPopup?: boolean
}

declare type CustomActionModalProps = {
  text?: string; 
  header?: string; 
  className?: string;
}

declare type CustomActionModalProps2 = {
  text: string; 
  header?: string; 
  className?: string;
}

declare type ModalButton = {
  className: string;
  action: VoidActon;
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
  isOpen: boolean;
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
  icon?: string;
  icon_svg?: React.ReactElement,
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


type ModalType = 'record' | 'upload' | 'video';

type ParentContentType = 'record' | 'thumbnail' | 'delete'

type RecordAction = 'check' | 'record' | 'load' | 'redirect' | 'save'

type UploadAction = ThumbnailAction | 'edit'

type ThumbnailAction =  'generate' | 'add'

type DeleteAction = 'delete' | 'to_profile'

type PostAction = DeleteAction | 'download'

type Action = RecordAction | UploadAction | PostAction;

type ActionStateType = 'before' | 'ongoing' | 'after'

type Action = 'delete' | 'download' | 'check' | 'generate'

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

declare type OnOpenArgs = {
  type: ModalType;
  closeIcon?: React.ReactNode
}

type ModalInitialActions = 'check' | 'generate' | 'edit' | 'delete' | 'download'

declare type OpenModalArgs = {
  action: ModalInitialActions | VoidAction,
  type: ModalType,
  parent?: ParentContentType | null,
  closeIcon?: React.ReactElement | null;
  addedCondition?: boolean,
} 


declare type VideoSettingsType = {
  cursor: CursorOptions;
  displaySurface: DisplaySurfaceOptions;
  camera: CameraOptions;
  cameraFacingMode: CameraFacingMode;
  withMic: boolean;
}

declare type RecordingTimerType = {
  seconds: string,
  minutes: string,
  hour: string
}

declare type StreamSettingsType = VideoSettingsType & {
  systemAudio: boolean
}

declare type RecordingDialogContentBodyProps = {
  modalParentContent: ActionStatusType | null,
  recordedVideoUrl: string,
  goToUpload: GoToUploadState | null,
  videoRef: RefObject<HTMLVideoElement | null>,
  failedCheck : string,
  showInstructions : boolean,
  videoSettings : VideoSettingsType,
  streamSettings : VideoSettingsType & {systemAudio: boolean},
  recordSettings: RecordSettingsType[],
  actionResponse: "failed" | "successful" | null;
}

declare type NoteProps = {
    settings: VideoSettingsType | StreamSettingsType,
    falseConditionRender: string | React.ReactElement,
    additionalFeature?: React.ReactElement | null,
    featureHeaderText?: string,
    className?: string,
}

declare type OngoingRecordingContentProps = {
  recordingStatus: RecordingState, 
  recordingTimer: RecordingTimerType,
  streamSettings: StreamSettingsType,
  screenShots: ImagesArrayType[],
  onPauseResume: VoidAction,
  onTakeScreenShot: VoidActon, 
  onScreenShotClick: (id: string) => void, 
}

declare type SuccessfulLoadBodyProps = {
  saveAction: NoNameModalActionType;
  onSaveRecording: VoidAction;
  recordedVideoUrl: string;
  screenShots: ImagesArrayType[];
  videoRef: Ref<HTMLVideoElement>;
  changeVideoPlaying: (state: boolean) => void;
  onScreenShotClick: (id: string) => void; 
}

declare type LoadBodyProps = {
  action: NoNameModalActionType;
  saveAction: NoNameModalActionType;
  onSaveRecording: VoidAction;
  recordedVideoUrl: string;
  screenShots: ImagesArrayType[];
  videoRef: Ref<HTMLVideoElement>;
  changeVideoPlaying: (state: boolean) => void;
  onScreenShotClick: (id: string) => void;
}

declare type StartRecordingBodyProps = {
  action: NoNameModalActionType;
  settings: VideoSettingsType;
  recordingStatus: RecordingState;
  recordingTimer: RecordingTimerType;
  streamSettings: StreamSettingsType;
  screenShots: ImagesArrayType[];
  failedNote: string;
  onPauseResume: VoidAction;
  onTakeScreenShot: VoidAction; 
  onScreenShotClick: (id: string) => void; 
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

declare type CheckBodyProps = {
  action: NoNameModalActionType;
  checkResponse: string;
  settings: RecordSettingsType[];
}

declare interface BunnyRecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordedVideoUrl: string;
  recordingDuration: number;
  recordingStatus: RecordingState;
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

declare type PaginationValuesType = {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  pageSize: number | unknown;
}

declare interface RecordingHandlers {
  onDataAvailable: (e: BlobEvent) => void;
  onStop: VoidActon;
}

type size = {ideal: number};

declare type VideoConfig = {
  width: size,
  height: size,
  frameRate?: size,
  facingMode?: string
}  

export type UserType = SessionUserType | DummyUserType