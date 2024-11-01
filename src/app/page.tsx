"use client";

import { ChangeEvent, useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import getCroppedImg from "./getCrop";

export type AreaPixedType = {
    x: number;
    y: number;
    width: number;
    height: number;
} | null;

export type unCroppedImg = string | ArrayBuffer | null;

export default function Home() {
    const [croppedImage, setCroppedImage] = useState<unCroppedImg>(null);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<AreaPixedType>(null);
    const imgInput = useRef<HTMLInputElement>(null);
    const [cropperModal, setCropperModal] = useState(false);

    const handleInputImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            setCropperModal(true);
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setCroppedImage(reader.result);
            };
        }
    };

    const handleCropImage = async () => {
        if (!croppedAreaPixels || !croppedImage) return; // 크롭 영역과 이미지가 있어야 함
        try {
            const cropped = await getCroppedImg(croppedImage as string, croppedAreaPixels);
            console.log("Cropped Image File:", cropped);
            setImgFile(cropped as File);
            setCropperModal(false);
            setCroppedImage(null); // 크롭한 이미지 리셋
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <ImageCropper
                croppedImage={croppedImage}
                setCroppedAreaPixels={setCroppedAreaPixels}
                cropperModal={cropperModal}
                handleCropImage={handleCropImage}
            />
            <button onClick={() => imgInput.current?.click()}>배경 변경</button>
            <input type="file" ref={imgInput} onChange={handleInputImageChange} style={{ display: "none" }} />
            {imgFile && <img src={URL.createObjectURL(imgFile)} alt="Cropped" />}
        </div>
    );
}
