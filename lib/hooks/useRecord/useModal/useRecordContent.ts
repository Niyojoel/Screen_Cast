import { useCallback } from "react"
import { useCheck } from "./useRecordActions/useCheck"
import { useLoad } from "./useRecordActions/useLoad"
import useRedirect from "./useRecordActions/useRedirect"
import useSave from "./useRecordActions/useSave"
import useStartRecording from "./useRecordActions/useStartRecord"
import { MappedAction, useGlobalContext } from "../../useGlobalContext"
import { ImagesArrayType, RecordSettingsType, StreamSettingsType, VideoSettingsType } from "@/index"
import { RecordingTimerType } from "../useRecordActions"

const useRecordContent = () => {
  const {checkContent} = useCheck()
  const {loadContent} = useLoad()
  const {saveContent} = useSave()
  const {redirectContent} = useRedirect()
  const {startRecordingContent} = useStartRecording()

  const recordContent = useCallback((
    //prop for all contents
    modalAction: MappedAction,

    //prop for check, start_recording and save content
    failedCheck: string,

    //prop for start_recording and load content
    screenShots: ImagesArrayType[],

    //prop for check content 
    recordSettings: RecordSettingsType[],

    //prop for start_recording content
    videoSettings: VideoSettingsType,
    streamSettings: StreamSettingsType,
    recordingStatus: RecordingState, 
    recordingTimer: RecordingTimerType,

    //prop for load content
    recordedVideoUrl: string,
  ) => {
    if (modalAction.name === 'check') {
        return checkContent(
            modalAction?.check,
            recordSettings,
            videoSettings,
            failedCheck,
        )
    } else if(modalAction.name === 'record') {
        return startRecordingContent(
            modalAction?.record,
            videoSettings,
            failedCheck,
            streamSettings,
            recordingStatus,
            recordingTimer,
            screenShots,
        )
    } else if(modalAction.name === 'load') {
        return loadContent(
            modalAction?.load,
            recordedVideoUrl,
            screenShots,
        )
    } else if(modalAction.name === 'redirect') {
        return redirectContent(modalAction?.redirect)

    } else {
        return saveContent(
            modalAction?.save_record,
            failedCheck
        )
    }
  },[])

  return {recordContent};
}

export default useRecordContent