import { useAddCaptionMutation } from "@/redux/api/courseApiSlice";
import { useGenerateUploadUrlMutation } from "@/redux/api/sectionApiSlice";
import axios from "axios";
import { Check } from "lucide-react";
import { useState, useRef } from "react";

const CaptionItem = ({ item, courseId, language }) => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const controllerRef = useRef(null);

    const [generateUploadURL] = useGenerateUploadUrlMutation();
    const handleUploadFile = async (e, item) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const isValidFile = validateFile(selectedFile);
        if (!isValidFile) {
            e.target.value = "";
            return;
        }

        await uploadFile(selectedFile, e, item);
    };

    const validateFile = (file) => {
        if (!file.name.toLowerCase().endsWith(".vtt")) {
            return false;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return false;
        }

        return true;
    };

    const uploadFile = async (file, e, item) => {
        setIsUploading(true);
        setProgress(0);

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            // 1. Lấy URL upload từ API
            const { uploadURL, s3Key, publicURL } = await generateUploadURL({
                courseId,
                type:
                    item.itemType === "promoVideo"
                        ? `course-promo-video/captions/${language}`
                        : `lecture-video/captions/${language}`,
                fileName: file.name,
                contentType: file.type,
            }).unwrap();

            // 2. Upload lên S3
            await axios.put(uploadURL, file, {
                headers: {
                    "Content-Type": file.type,
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                },
                signal: controller.signal,
            });

            const captionData = {
                videoType: item.itemType,
                itemId: item._id,
                caption: {
                    s3Key,
                    publicURL,
                    language,
                    status: "uploaded",
                },
            };

            await addCaption({ courseId, caption: captionData });
        } catch (error) {
            if (axios.isCancel(error)) {
                console.error("Hủy upload");
            } else {
                console.error("Lỗi upload:", error);
                alert("Lỗi upload: " + error.message);
            }
        } finally {
            // Reset input file
            e.target.value = "";
            setIsUploading(false);
            setProgress(0);
        }
    };

    const [addCaption] = useAddCaptionMutation();

    return (
        <div>
            {isUploading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-[9999]">
                    <div className="flex flex-col items-center justify-center -translate-y-[50%]">
                        <div className="text-white mb-2">Đang tải file lên...</div>
                        <div className="flex items-center gap-3">
                            <div className="w-[500px] bg-gray-300 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (controllerRef.current) {
                                        controllerRef.current.abort();
                                    }
                                }}
                                className="text-gray-300 cursor-pointer p-1 pointer-events-auto"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3 w-[50%]">
                    {item.content?.captions ? (
                        <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                        </span>
                    ) : (
                        <span className="w-4 h-4 border border-gray-400 rounded-full"></span>
                    )}
                    <span className="">{item.title}</span>
                </div>

                <div className="flex items-center justify-between flex-1 gap-4 text text-gray-600">
                    {item.captionStatus}
                    {item.captionStatus !== "Chưa có phụ đề" ? (
                        <button className="px-3 py-1 min-w-[84px] border border-primary text-primary rounded hover:bg-primary/10 transition">
                            Sửa
                        </button>
                    ) : (
                        <label className="px-3 py-1 text-center min-w-[84px] border border-primary text-primary rounded hover:bg-primary/10 transition">
                            Tải lên
                            <input
                                type="file"
                                accept=".vtt,text/vtt,video/webvtt"
                                onChange={(e) => handleUploadFile(e, item)}
                                hidden
                            />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaptionItem;
