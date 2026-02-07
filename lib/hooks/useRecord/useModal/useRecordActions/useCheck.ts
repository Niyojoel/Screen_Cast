import { useCallback } from "react"
import { NoNameModalActionType } from "../../../useGlobalContext"
import { ModalContentType, RecordSettingsType, VideoSettingsType } from "@/index"
import { checkBody, goBackButton} from "@/constants/lists"
import { getActionStateButtons, getModalButton } from "@/lib/modalContentUtil"
import useRecordActions from "../../useRecordActions"

export const useCheck = () => {
    const {
        handleCheckDevices,
        handleGoBack
    } = useRecordActions()

    const checkContent = useCallback((
        action: NoNameModalActionType, 
        settings: RecordSettingsType[],
        videoSettings: VideoSettingsType,
        failedCheck: string,
    ): ModalContentType => ({
        body: checkBody(action, failedCheck, settings),
        buttons: getActionStateButtons(
            action,
            [
                goBackButton(handleGoBack, 'Adjust setting'), 
                getModalButton('Retry Check', () => handleCheckDevices(videoSettings))
            ],
            [
                getModalButton("Continue", () => handleCheckDevices(videoSettings))
            ]
        )
    }), [getActionStateButtons, getModalButton, handleCheckDevices])

    return {checkContent};
}