import CaptionItem from "@/components/instructor/captions/CaptionItem";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetCaptionStatusQuery } from "@/redux/api/courseApiSlice";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const LANGUAGE_OPTIONS = [
    { value: "en", label: "Tiếng Anh" },
    { value: "vi", label: "Tiếng Việt" },
];

const Captions = () => {
    const { courseId } = useParams();
    const { data, isLoading } = useGetCaptionStatusQuery(courseId);

    const [activeTab, setActiveTab] = useState("all");
    const [captionLanguage, setCaptionLanguage] = useState();

    useEffect(() => {
        if (data?.defaultLanguage) {
            const option = LANGUAGE_OPTIONS.find((option) => option.label === data.defaultLanguage);
            if (option) {
                setCaptionLanguage(option.value);
            }
        }
    }, [data]);



    if (isLoading) {
        return <div></div>;
    }

    const getCaptionStatus = (captions, language) => {
        if (!captions || captions.length === 0) {
            return "Chưa có phụ đề";
        }

        // Tìm caption theo language
        const caption = captions.find((cap) => cap.language === language);

        // Nếu không tìm thấy caption với language đó
        if (!caption) {
            return "Chưa có phụ đề";
        }

        const status = caption.status;

        switch (status) {
            case "auto-generated":
                return "Tạo tự động";
            case "edited":
                return "Đã chỉnh sửa";
            case "uploaded":
                return "Đã tải lên";
            default:
                return "Chưa có phụ đề";
        }
    };


    const captionsWithStatus = data.captions.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
            ...item,
            captionStatus: getCaptionStatus(item.content?.captions, captionLanguage),
        })),
    }));

    const filtered = captionsWithStatus.map((section) => ({
        ...section,
        items:
            activeTab === "all" ? section.items : section.items.filter((i) => !i.content?.captions),
    }));

    console.log(filtered)

    return (
        <div>
            <div>
                <div className="flex justify-between items-center p-5 border-b border-b-grayText/20">
                    <div className="flex gap-2">
                        <h2 className="text-lg text-nowrap">Phụ đề</h2>
                        <Select
                            className="block relative top-2"
                            value={captionLanguage}
                            onValueChange={(value) => {
                                setCaptionLanguage(value);
                            }}
                        >
                            <SelectTrigger className="relative -top-1 w-full px-3 min-h-9 text-[16px] rounded  border-gray-300">
                                <SelectValue placeholder="Chọn ngôn ngữ" value={captionLanguage} />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGE_OPTIONS.map((lang, index) => (
                                    <SelectItem key={index} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <button className="text-sm px-3 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition">
                        Tạo caption tự động
                    </button>
                </div>

                <div className="p-5">
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-3 py-1 cursor-pointer rounded border ${
                                activeTab === "all" ? "bg-primary text-white" : "border-gray-300"
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setActiveTab("uncaptioned")}
                            className={`px-3 py-1 rounded border cursor-pointer ${
                                activeTab === "uncaptioned"
                                    ? "bg-primary text-white"
                                    : "border-gray-300"
                            }`}
                        >
                            Chưa có phụ đề
                        </button>
                    </div>

                    <div className="space-y-8">
                        {filtered.map((section, idx) => {
                            if (section.items.length > 0)
                                return (
                                    <div key={idx}>
                                        <h3 className="text font-semibold mb-2">
                                            {section.sectionTitle}
                                        </h3>
                                        <div className="space-y-3">
                                            {section.items.map((item, i) => {
                                                // console.log(item);
                                                return (
                                                    <CaptionItem key={i} item={item} courseId={courseId} language={captionLanguage}></CaptionItem>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Captions;
