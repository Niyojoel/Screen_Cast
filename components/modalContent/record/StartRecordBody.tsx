
import { StartRecordingBodyProps } from "@/index";
import { MODAL_ICONS } from "@/constants/lists";
import { showOrHide } from "@/lib/modalContentUtil";
import {
  ModalBody,
  FailedActionModalBody,
  OngoingActionModalBody,
} from "@/components";
import { 
  BeforeRecordingBody, 
  SuccessfulRecordingBody 
} from "./sub-components";

const StartRecordingBody = ({
  action,
  settings,
  recordingStatus,
  recordingTimer,
  streamSettings,
  screenShots,
  failedNote,
  onPauseResume,
  onTakeScreenShot, 
  onScreenShotClick 
}: StartRecordingBodyProps) => {
  const {state, response} = action;

  return (
    <>
      <ModalBody
        icon={MODAL_ICONS.info}
        headerNode = 'Guide'
        subNode = {<BeforeRecordingBody videoSettings={settings}/>}
        actionPopup = {false}
        className={`${showOrHide(state === 'before')} mt-1`}
      />
      <OngoingActionModalBody 
        text = 'Starting recording session...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text={failedNote} 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      /> 
      <ModalBody
        subNode = {
          <SuccessfulRecordingBody       
            recordingStatus = {recordingStatus}
            recordingTimer = {recordingTimer}
            streamSettings = {streamSettings}
            screenShots = {screenShots}
            onPauseResume={onPauseResume}
            onTakeScreenShot={onTakeScreenShot} 
            onScreenShotClick={onScreenShotClick} 
          />
        }
        className={showOrHide(state === 'after' && response === 'successful')}
      />
    </>
  )
}

export default StartRecordingBody;