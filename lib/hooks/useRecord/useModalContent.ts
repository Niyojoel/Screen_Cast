
import { 
    useCallback, 
} from "react";
import recordParentContent from "@/components/modalContent/record"
import { 
    ActionNoParams,
    ActionParam, 
    MappedAction, 
    NoNameModalActionType, 
    VoidAction, 
    VoidActionParam, 
    VoidActionParamsOptional,
    VoidActionParamsOptionals, 
} from "../useModalContext.tsx"
import useRecordActions from "./useModalActions.ts"
import { 
    ImagesArrayType, 
    ParentContentType, 
    RecordSettingsType, 
    RecordingTimerType, 
    StreamSettingsType, 
    VideoSettingsType 
} from "@/index.js";

const useModalContent = () => {

  const {
    failedCheck,
    videoRef,
    changeVideoPlaying,
    onCheckDevices: checkDevices,
    onRecordAgain: recordAgain,
    onStopRecording: onStopRecording_,
    onContinueRecording,
    onGoToUpload: goToUpload,
    onGoBack,
    onStartRecording: onStartRecording_,
    onStopWarning: stopWarning,
    onExitModal: exitModal,
  } = useRecordActions()

  const recordContent = useCallback((
    modalAction: MappedAction,
    modalContentParent: ParentContentType | null,
    videoSettings: VideoSettingsType, 
    recordSettings: RecordSettingsType[],
    recordedBlob: Blob | null,
    recordedVideoUrl: string,
    recordingDuration: number,
    recordingStatus: "inactive" | "paused" | "recording",
    streamSettings: StreamSettingsType,
    recordingTimer: RecordingTimerType,
    saveRecord: NoNameModalActionType,
    onSaveRecording_: VoidActionParam<Blob | null>,
    startRecording: ActionParam<VideoSettingsType, Promise<boolean>>,
    stopRecording: VoidAction,
    resetRecording: VoidAction,
    onPauseResume: VoidAction,
    takeScreenShot: ActionNoParams<Promise<ImagesArrayType | null>>,
    screenShots: ImagesArrayType[],
    resetScreenShots: VoidAction,
    changeScreenShots: VoidActionParam<ImagesArrayType>,
    onScreenShotClick: VoidActionParamsOptionals<string, boolean, string>,
  ) => {

    const onTakeScreenShot = async () => {
        const newShot = await takeScreenShot();

        if(!newShot) return;

        changeScreenShots(newShot);
    };

    const onStartRecording = () => {
        const start = async () => await startRecording(videoSettings)
        resetScreenShots();
        onStartRecording_(start);
    }

    const onGoToUpload = () => {
        goToUpload(recordedBlob, recordingDuration, screenShots)
    }

    const onStopWarning = () => {
        stopWarning(recordingStatus, onPauseResume)
    }

    const onExitModal = () => {
        exitModal(resetRecording)
    };
    
    const onCheckDevices = () => {
        checkDevices(videoSettings);
    };

    const onRecordAgain = () => {
        recordAgain(resetRecording)
    }

    const onStopRecording = () => {
        onStopRecording_(stopRecording);
    }

    const onSaveRecording = () => {
        onSaveRecording_(recordedBlob);
    }

    const checkableFSImage = (id: string) => {
        onScreenShotClick(id, true, "checkable")
    }

    if(modalContentParent === 'record') {
        return recordParentContent(
            modalAction,
            failedCheck,
            recordSettings,
            videoSettings,
            saveRecord,
            recordedVideoUrl,
            screenShots,
            videoRef,
            recordingStatus,
            streamSettings,
            recordingTimer,
            onGoBack,
            onCheckDevices,
            onRecordAgain,
            onStartRecording,
            onStopWarning,
            onStopRecording,
            onContinueRecording,
            onGoToUpload,
            onSaveRecording,
            onExitModal,
            changeVideoPlaying,
            onScreenShotClick,
            checkableFSImage,
            onPauseResume,
            onTakeScreenShot,
        )
    } else return null;
  },[])

  return {recordContent};
}

export default useModalContent