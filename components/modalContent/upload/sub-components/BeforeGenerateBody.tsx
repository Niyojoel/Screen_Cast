import { ModalBody } from "@/components";
import { ChangeEvent } from "react";

type BeforeGenerateBodyProps = {
    captureTime: number, 
    className: string,
    onCaptureTimeChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const BeforeGenerateBody = ({
    captureTime, 
    className, 
    onCaptureTimeChange
}: BeforeGenerateBodyProps) => (
    <ModalBody
        headerNode = 'Generate Thumbnail'
        subNode = {
            <span className="thumbnail-generate">
                <pre>
                    <label htmlFor="gen">
                        Time of video capture : 
                    </label>
                    <input 
                        id="gen" 
                        hidden={false} 
                        value={captureTime} 
                        onChange={onCaptureTimeChange}
                    />
                </pre>  
            </span>
        }
        className={className}
    />
);

export default BeforeGenerateBody;