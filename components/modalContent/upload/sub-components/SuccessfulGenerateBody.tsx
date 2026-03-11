import { ModalBody } from "@/components";
import { VoidAction } from "@/lib/hooks/useModalContext";
import Image from "next/image";

type SuccessfulGenerateBodyProps = {
    imageUrl: string, 
    className: string, 
    fullScreenView: VoidAction
}

//Upload modal contents
//image not showing due to absolute and inset style set
const SuccessfulGenerateBody = ({
    imageUrl, 
    className, 
    fullScreenView
}: SuccessfulGenerateBodyProps) => (
    <ModalBody
        subNode={
            imageUrl && (
                <span className="relative w-full cursor-pointer" onClick={fullScreenView}>
                    <Image 
                        src={imageUrl} 
                        alt= "generated_thumbnail" 
                        width={500}
                        height={300}
                        className="w-full object-contain"
                    />
                </span>
            )
        }
        className={className}
    />
);

export default SuccessfulGenerateBody;
