import { 
    DropdownOptionsType,
    VideoSettingsType
} from "@/index";
import { parseVideoSettings } from "@/lib/utils";
import { 
    memo, 
    useCallback, 
    useEffect, 
    useMemo, 
    useState 
} from "react";
import { DropdownList } from "@/components";

interface RecordSettingsType {
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

const RecordingSettings = memo(({ recordSettings }: {recordSettings: RecordSettingsType[]}) => (
    <ul className='recording-settings'>
        <div className='settings-col-grid'>
            {recordSettings.map((setting, index)=> (
                <RecordSetting
                    key={index}
                    idIcon={setting.idIcon}
                    title = {setting?.title}
                    options= {setting.options}
                    updateSetting= {setting.updateSetting}
                    settingValue={setting.settingValue}
                    className={setting.className}
                    disabled= {setting?.disabled}
                />
            ))}
        </div>
    </ul>
))

const RecordSetting = memo(({
    title, 
    options, 
    updateSetting, 
    settingValue,
    className,
    idIcon,
    disabled
}: RecordSettingsType) => {

    const activeOption: DropdownOptionsType = useMemo(()=> options.find(option => parseVideoSettings(settingValue[0], option.label) === settingValue[1]), [options, settingValue, parseVideoSettings])!; 

    const [selectedOption, setSelectedOption] = useState(activeOption);

    const updateSetting_ = useCallback((option: DropdownOptionsType) => {
        updateSetting(option.label)
    },[updateSetting])

    useEffect(()=> {
        setSelectedOption(activeOption);
    },[activeOption])

    const dropdown = () => (
        <DropdownList
            activeOption={selectedOption}
            options={options}
            onSelectAction={updateSetting_}
            disabled = {disabled && disabled}
        />
    ) 

    return (
        <li className={`setting ${className}`}>
            {title && <p>{title}</p>}
                {idIcon ? (
                    <div className='setting-identifier'>
                        <i>{idIcon}</i>
                        <span>{dropdown()}</span>
                    </div>
                ): (dropdown())}
        </li>
    )
});

export default RecordingSettings;