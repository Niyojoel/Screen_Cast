import { CameraOptions, DisplaySurfaceOptions, RecordSettingsType, VideoSettingsType } from '@/index';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SyncCameraKeys } from './useRecordActions';
import { parseVideoSettings, syncCameraOnly } from '@/lib/utils';
import { cameraMode, cameraSettingsOptions, cursorDisplayOptions, cursorDisplayOptionsIcon, micSettingsOptions, micSettingsOptionsIcon, screenSettingsOptions } from '@/constants/lists';

const useSettings = () => {

   //Settings
  const [videoSettings, setVideoSettings] = useState<VideoSettingsType>({
    cursor: "always",
    displaySurface: "monitor",
    camera: 'no',
    cameraFacingMode: 'user',
    withMic: true,
  });
  

  //Settings ------------
  const helpVideoSettings = useCallback((
    key: keyof VideoSettingsType, 
    value: VideoSettingsType[keyof VideoSettingsType]
  ) => {
    setVideoSettings(prev => ({...prev, [key]: value}));
  },[])

  const syncCamera = useCallback(async(
    key: keyof SyncCameraKeys, 
    value: DisplaySurfaceOptions | CameraOptions
  ) => {
    const syncSetting = await syncCameraOnly(
      key, 
      value,
      {
        displaySurface: videoSettings.displaySurface,
        camera: videoSettings.camera
      }
    )
    if(syncSetting) helpVideoSettings(syncSetting[0], syncSetting[1]);

  },[videoSettings])
  
  const updateSettings = useCallback((key: keyof VideoSettingsType, option: string) => {
    const value: VideoSettingsType[keyof VideoSettingsType] = parseVideoSettings(key, option);

    helpVideoSettings(key, value);

    if(key === "displaySurface" || "camera") {
      syncCamera(
        key as keyof SyncCameraKeys, 
        value as DisplaySurfaceOptions | CameraOptions
      )
    }
  },[syncCamera]);

  const recordSettings = useMemo((): RecordSettingsType[] => [
    {
      title: "Screen Settings",
      options: screenSettingsOptions,
      updateSetting: (option) => updateSettings('displaySurface', option),
      settingValue: ['displaySurface', videoSettings.displaySurface],
      className:'col-span-5',
    },
    {
      idIcon: cursorDisplayOptionsIcon(videoSettings.cursor === "never"),
      options: cursorDisplayOptions,
      updateSetting: (option) => updateSettings('cursor', option),
      settingValue: ['cursor', videoSettings.cursor],
      className:'col-span-5',
    },
    {
      title: "Camera Settings",
      options: cameraSettingsOptions,
      updateSetting: (option) => updateSettings('camera', option),
      settingValue: ['camera', videoSettings.camera],
      className:'col-span-3',
    },
    {
      options: cameraMode,
      updateSetting: (option) => updateSettings('cameraFacingMode', option),
      settingValue: ['cameraFacingMode', videoSettings.cameraFacingMode],
      className:'col-span-2 place-self-end',
      disabled: videoSettings.camera === "no",
    },
    {
      idIcon: micSettingsOptionsIcon(videoSettings.withMic),
      options: micSettingsOptions,
      updateSetting: (option) => updateSettings('withMic', option),
      settingValue: ['withMic', videoSettings.withMic],
      className:'col-span-5',
    },
  ],[
    updateSettings,
    screenSettingsOptions, 
    cursorDisplayOptions, 
    cameraSettingsOptions, 
    cameraMode, 
    videoSettings, 
    micSettingsOptions
  ])

  useEffect(() => console.log(videoSettings), [videoSettings])

  return {videoSettings, recordSettings}
}

export default useSettings