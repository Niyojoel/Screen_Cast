'use client'
import { 
  useCallback, 
  useState 
} from "react";
import { 
  ActionResponseType, 
  ActionStateType, 
  BeforeModalActionType 
} from "@/index";
import { downloadVideo } from "@/lib/utils";

const useSaveRecordActions = () => {

  const [saveRecord, setSaveRecord] = useState<Omit<BeforeModalActionType, 'name'>>({
    state: 'before', 
    response: null
  })

  const changeSavedRecord = useCallback((
    state: ActionStateType, 
    response?: ActionResponseType
  ) => {

    setSaveRecord((prev) => {
      return {
        state,
        response: response || prev.response
      }
    })
  },[])

  const onSaveRecording = useCallback(async (recordedBlob: Blob | null) => {
    if(!recordedBlob) return;
    try {
      changeSavedRecord('ongoing');
      const videoUrl = URL.createObjectURL(recordedBlob);
      const response = await downloadVideo(videoUrl);
      if(response) changeSavedRecord('after', 'successful');
      setTimeout(()=> changeSavedRecord('before'), 2000);
    }catch(error){
      changeSavedRecord('after', 'failed');
    }
  },[])

  return {
    saveRecord,
    changeSavedRecord,
    onSaveRecording
  }
}

export default useSaveRecordActions