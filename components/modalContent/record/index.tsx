import { 
    ImagesArrayType, 
    RecordSettingsType, 
    RecordingTimerType, 
    StreamSettingsType, 
    VideoSettingsType 
} from "@/index";
import { 
    MappedAction, 
    NoNameModalActionType, 
    VoidAction, 
    VoidActionParam 
} from "@/lib/hooks/useModalContext";
import { RefObject } from "react";
import CheckBody from "./CheckBody";
import LoadBody from "./LoadBody";
import RedirectBody from "./RedirectBody";
import { 
  checkButtons, 
  loadButtons, 
  recordRedirectButtons, 
  saveButtons, 
  startRecordingButtons 
} from "@/constants/lists";
import SaveBody from "./SaveBody";
import StartRecordingBody from "./StartRecordBody";

const recordParentContent = (
  modalAction: MappedAction, 
  failedNote: string, 
  recordSettings: RecordSettingsType[],
  videoSettings: VideoSettingsType,
  saveAction: NoNameModalActionType,
  recordedVideoUrl: string,
  screenShots: ImagesArrayType[],
  videoRef: RefObject<HTMLVideoElement | null>,
  recordingStatus: RecordingState,
  streamSettings: StreamSettingsType,
  recordingTimer: RecordingTimerType,
  onGoBack: VoidAction,
  onCheckDevices: VoidAction,
  onRecordAgain: VoidAction,
  onStartRecording: VoidAction,
  onStopWarning: VoidAction,
  onStopRecording: VoidAction,
  onContinueRecording: VoidAction,
  onGoToUpload: VoidAction,
  onSaveRecording: VoidAction,
  onExit: VoidAction, 
  changeVideoPlaying: VoidActionParam<boolean>,
  onScreenShotClick: VoidActionParam<string>, 
  checkableFSImage: VoidActionParam<string>,
  onPauseResume: VoidAction,
  onTakeScreenShot: VoidAction, 
) => {
    
  if (modalAction.name === 'check') {
    return {
      body: (
        <CheckBody
          action={modalAction?.check} 
          checkResponse={failedNote} 
          settings={recordSettings}
        />
      ),
      buttons: checkButtons (
        modalAction?.check,
        onGoBack,
        onCheckDevices
      )
    }
  } else if(modalAction.name === 'record') {
    return {
      body: (
        <StartRecordingBody
          action={modalAction?.record}
          settings={videoSettings}
          recordingStatus={recordingStatus}
          recordingTimer={recordingTimer}
          streamSettings={streamSettings}
          screenShots={screenShots}
          failedNote={failedNote}
          onPauseResume={onPauseResume}
          onTakeScreenShot={onTakeScreenShot} 
          onScreenShotClick={onScreenShotClick} 
        />
      ),
      buttons: startRecordingButtons(
        modalAction?.record,
        onGoBack,
        onStartRecording,
        onStopWarning
      )
    }
  } else if(modalAction.name === 'load') {
    return {
      body: (
        <LoadBody
          action={modalAction?.load}
          saveAction={saveAction}
          onSaveRecording={onSaveRecording}
          recordedVideoUrl={recordedVideoUrl}
          screenShots={screenShots}
          videoRef={videoRef}
          changeVideoPlaying={changeVideoPlaying}
          onScreenShotClick={checkableFSImage} 
        />
      ),
      buttons: loadButtons(
        modalAction?.load,
        onRecordAgain,
        onStopRecording,
        onContinueRecording,
        onGoToUpload,
      )
    }
  } else if(modalAction.name === 'redirect') {
    return {
      body: <RedirectBody action={modalAction?.redirect}/>,
      buttons: recordRedirectButtons (
        modalAction?.redirect,
        onSaveRecording,
        onGoToUpload
      )
    }
  } else if(modalAction.name === 'save') {
    return {
      body: <SaveBody action={modalAction?.save}/>,
      buttons: saveButtons (
        modalAction?.save,
        onSaveRecording,
        onExit
      )
    }
  } else return null;
}

export default recordParentContent;