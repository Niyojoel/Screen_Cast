import { useCallback, useMemo } from "react";
import useRecordActions, { RecordingTimerType } from "../../useRecordActions"
import { NoNameModalActionType } from "../../../useGlobalContext";
import { ImagesArrayType, ModalContentType, StreamSettingsType, VideoSettingsType } from "@/index";
import { goBackButton, saveBody, startRecordBody } from "@/constants/lists";
import { getActionStateButtons, getModalButton } from "@/lib/modalContentUtil";

const useStartRecording = () => {

  const {
    handleGoBack, 
    handleStartRecording, 
    handleStopWarning
  } = useRecordActions();

  const recordButtons = useCallback((settings: VideoSettingsType) => [
    goBackButton(handleGoBack), 
    getModalButton('Record', () => handleStartRecording(settings))
  ],[goBackButton, getModalButton, handleStartRecording])

  const startRecordingContent = useCallback((
    action: NoNameModalActionType,
    videoSettings: VideoSettingsType,
    failedCheck: string,
    streamSettings: StreamSettingsType,
    recordingStatus: RecordingState, 
    recordingTimer: RecordingTimerType,
    screenShots: ImagesArrayType[]
  ): ModalContentType => {

    // const beforeContent = 

    return {
        body: startRecordBody(
          action,
          videoSettings,
          recordingStatus,
          recordingTimer,
          streamSettings,
          screenShots,
          failedCheck,
        ),
        buttons: getActionStateButtons(
            action,
            recordButtons(videoSettings),
            recordButtons(videoSettings),
            [
                getModalButton('Stop recording', handleStopWarning)
            ],
        )
    }
  }, [getActionStateButtons, recordButtons, handleStopWarning])


  return {startRecordingContent}
}

export default useStartRecording