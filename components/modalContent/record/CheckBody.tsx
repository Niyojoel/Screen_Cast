
import { CheckBodyProps } from "@/index"
import { showOrHide } from "@/lib/modalContentUtil"
import { 
    FailedActionModalBody, 
    OngoingActionModalBody, 
    SuccessfulActionModalBody,
    ModalBody
} from "@/components";
import { RecordingSettings } from "./sub-components";

const CheckBody = ({
    action, 
    checkResponse, 
    settings
}: CheckBodyProps) => {
    const {state, response} = action;

    return (
        <>
            <ModalBody 
              subNode={<RecordingSettings recordSettings={settings}/>} 
              className={showOrHide(state === 'before')}
            />
            <OngoingActionModalBody 
              text='Checking user devices...' 
              className={showOrHide(state === 'ongoing')}
            />
            <FailedActionModalBody 
              header='Check failed' 
              text={checkResponse} 
              className={showOrHide(state === 'after' &&  response === 'failed')}
            />
            <SuccessfulActionModalBody 
              text ='Check passed' 
              className={showOrHide(state === 'after' && response === 'successful')}/>
        </>
    )
}

export default CheckBody;
