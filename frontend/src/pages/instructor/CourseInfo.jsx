import { useState, useRef } from "react";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
const course = {
    title: "Demo",
    category: "IT & Phần mềm",
};

const LANGUAGE_OPTIONS = [
    { value: "English (US)", label: "Tiếng Anh (US)" },
    { value: "English (UK)", label: "Tiếng Anh (Uk)" },
    { value: "Vietnamese", label: "Tiếng Việt" },
];

const LEVEL_OPTIONS = [
    { value: "Beginner", label: "Người mới bắt đầu" },
    { value: "Intermediate", label: "Trung cấp" },
    { value: "Advanced", label: "Nâng cao" },
    { value: "All Levels", label: "Mọi trình độ" },
];

const CATEGORY_OPTIONS = {
    development: {
        label: "Phát triển",
        subcategories: [
            { label: "Phát triển web", value: "web-development" },
            { label: "Khoa học dữ liệu", value: "data-science" },
            { label: "Phát triển ứng dụng di động", value: "mobile-development" },
            { label: "Phát triển game", value: "game-development" },
            { label: "Phát triển và thiết kế cơ sở dữ liệu" },
        ],
    },

    business: {
        label: "Kinh doanh",
        subcategories: [
            { label: "Quản lý", value: "management" },
            { label: "Bán hàng", value: "sales" },
            { label: "Chiến dịch kinh doanh", value: "business-strategy" },
            { label: "Luật kinh doanh", value: "business-law" },
            { label: "Thương mại điện tử", value: "e-commerce" },
        ],
    },
    "finance-accounting": {
        label: "Tài chính & Kế toán",
        subcategories: [
            { label: "Kế toán & Ghi sổ", value: "accounting-bookkeeping" },
            { label: "Tài chính", value: "finance" },
            { label: "Đầu tư", value: "investing" },
            { label: "Thuế", value: "taxes" },
        ],
    },
    "it-software": {
        label: "IT & Phần mềm",
        subcategories: [
            { label: "Mạng và Bảo mật", value: "network-security" },
            { label: "Phần cứng", value: "hardware" },
            { label: "Hệ điều hành", value: "operating" },
            { label: "Khác", value: "other-it" },
        ],
    },
    design: {
        label: "Thiết kế",
        subcategories: [
            { label: "Thiết kế web", value: "web-design" },
            { label: "Thiế kế đồ họa", value: "graphic-design" },
            { label: "3D & Animation", value: "animation" },
            { label: "Thiết kế thời trang", value: "fashion-design" },
        ],
    },
    marketing: {
        label: "Tiếp thị",
        subcategories: [
            { value: "digital-marketing", label: "Tiếp thị kỹ thuật số" },
            {
                value: "social-media-marketing",
                label: "Tiếp thị mạng xã hội",
            },
            { value: "branding", label: "Xây dựng thương hiệu" },
            { value: "content-marketing", label: "Tiếp thị nội dung" },
        ],
    },
    health: {
        label: "Sức khỏe",
        subcategories: [
            { value: "nutrition", label: "Dinh dưỡng" },
            { value: "mental-health", label: "Sức khỏe tinh thần" },
            { value: "fitness", label: "Thể hình & Tập luyện" },
            { value: "yoga", label: "Yoga & Thiền" },
        ],
    },
    "photography-video": {
        label: "Nhiếp ảnh & Video",
        subcategories: [
            {
                value: "photography-basics",
                label: "Nhiếp ảnh cơ bản",
            },
            { value: "photo-editing", label: "Chỉnh sửa ảnh" },
            { value: "videography", label: "Quay video" },
            { value: "video-editing", label: "Dựng phim & Hậu kỳ" },
        ],
    },
    music: {
        label: "Âm nhạc",
        subcategories: [
            { value: "music-theory", label: "Lý thuyết âm nhạc" },
            { value: "instrument", label: "Chơi nhạc cụ" },
            { value: "singing", label: "Thanh nhạc" },
            { value: "music-production", label: "Sản xuất âm nhạc" },
        ],
    },
    teaching: {
        label: "Giảng dạy",
        subcategories: [
            { id: "teaching-methods", label: "Phương pháp giảng dạy" },
            { id: "education-technology", label: "Công nghệ giáo dục" },
            { id: "classroom-management", label: "Quản lý lớp học" },
            { id: "curriculum-design", label: "Thiết kế chương trình học" },
        ],
    },
};

const CourseInfo = () => {
    const [formData, setFormData] = useState({
        title: course.title || "",
        subtitle: course.subtitle || "",
        description: course.description || "",
        category: course.category,
        subcategory: course.subcategory,
        price: course.price,
        language: course.language,
        level: course.level,
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleQuillChange = (content, delta, source, editor) => {
        setFormData((prev) => ({
            ...prev,
            description: content,
        }));
    };

    const [courseImage, setCourseImage] = useState(null);
    const [promoVideo, setPromoVideo] = useState(null);
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPromoVideo(url);

            // Tạo thumbnail từ video
            const video = document.createElement("video");
            video.src = url;
            video.currentTime = 1; // Lấy frame tại giây thứ 1
            video.addEventListener("loadeddata", () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setVideoThumbnail(canvas.toDataURL());
            });
        }
    };

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleSubmit = () => {};

    return (
        <div>
            <div className="fixed w-full h-[50px] top-0 left-0"></div>
            <div>
                <h3 className="text-lg p-5 border-b border-b-grayText/20">Thông tin khóa học</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-5">
                {/* Course title */}
                <div className="space-y-2">
                    <label htmlFor="title">Tiêu đề khóa học</label>
                    <div className="relative mt-1">
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            maxLength={52}
                            placeholder="Nhập tiêu đề khóa học"
                            className="border px-3 py-2 border-gray-300 rounded w-full focus:border-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            {60 - formData.title.length}
                        </span>
                    </div>
                </div>

                {/* Course subtitle */}
                <div className="">
                    <label htmlFor="subtitle">Tiêu đề phụ khóa học</label>
                    <div className="relative mt-1">
                        <input
                            id="subtitle"
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => handleChange("subtitle", e.target.value)}
                            maxLength={120}
                            placeholder="Nhập tiêu đề phụ khóa học"
                            className="border px-3 py-2 border-gray-300 rounded w-full focus:border-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            {120 - formData.subtitle.length}
                        </span>
                    </div>
                </div>
                <div>
                    <p>Mô tả bài giảng</p>
                    <div className="rounded-[6px] mt-1 focus-within:ring-blue-500 focus-within:ring-1 transition-colors">
                        <ReactQuillNew
                            className="article-lecture-editor description-lecture-editor"
                            theme="snow"
                            value={formData.description}
                            onChange={handleQuillChange}
                            placeholder="Nhập mô tả khóa học"
                            modules={{
                                toolbar: [
                                    ["bold", "italic", "underline"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                ],
                            }}
                        ></ReactQuillNew>
                    </div>
                </div>
                <div className="">
                    <h3 className="font-semibold">Thông tin cơ bản</h3>

                    <div className="grid grid-cols-3 gap-4 mt-1">
                        {/* Language Select */}
                        <div className="flex flex-col gap-1">
                            <label>Ngôn ngữ</label>
                            <Select
                                value={formData.language}
                                onValueChange={(value) => handleChange("language", value)}
                            >
                                <SelectTrigger className="w-full px-3 py-2 min-h-[41px] text-[16px] rounded  border-gray-300">
                                    <SelectValue
                                        placeholder="Chọn ngôn ngữ"
                                        value={course.language}
                                    />
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

                        <div className="flex flex-col gap-1">
                            <label className="">Cấp độ</label>
                            <Select
                                value={formData.level}
                                onValueChange={(value) => handleChange("level", value)}
                            >
                                <SelectTrigger className="w-full px-3 py-2  min-h-[41px] text-[16px] rounded leading-normal border-gray-300">
                                    <SelectValue placeholder="-- Chọn cấp độ --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEVEL_OPTIONS.map((level, index) => (
                                        <SelectItem key={index} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Select */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="">Danh mục</label>
                                <Select
                                    className="text-[16px]"
                                    value={formData.category}
                                    onValueChange={(value) => handleChange("category", value)}
                                >
                                    <SelectTrigger className="w-full px-3 py-2 min-h-[41px] text-[16px] rounded leading-normal border-gray-300">
                                        <SelectValue placeholder="--Chọn danh mục--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(CATEGORY_OPTIONS).map(
                                            ([value, { label }]) => (
                                                <SelectItem key={value} value={label}>
                                                    {label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="">Danh mục con</label>
                                <Select
                                    
                                    className="text-[16px]"
                                    value={formData.subcategory}
                                    onValueChange={(value) => handleChange("subcategory", value)}
                                >
                                    <SelectTrigger className="w-full px-3 py-2 min-h-[41px] text-[16px] rounded leading-normal border-gray-300">
                                        <SelectValue placeholder="--Chọn danh mục con--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formData.category &&
                                            Object.values(CATEGORY_OPTIONS)
                                                .find((cat) => cat.label === formData.category)
                                                .subcategories.map((sub) => (
                                                    <SelectItem key={sub.value} value={sub.label}>
                                                        {sub.label}
                                                    </SelectItem>
                                                ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <h3 className="font-semibold mb-2">Ảnh khóa học</h3>
                    <div className="flex gap-6">
                        {/* Left box - Image preview */}
                        <div className="w-1/2 border h-[260px] border-gray-300 rounded flex items-center justify-center bg-gray-50">
                            {courseImage ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={courseImage}
                                        alt="Course preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <svg
                                        className="w-32 h-32 mx-auto text-gray-400 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-gray-500">Chưa có ảnh được tải lên</p>
                                </div>
                            )}
                        </div>

                        <div className="w-1/2">
                            <p className="text-gray-700 mb-4">
                                Tải lên hình ảnh khóa học của bạn ở đây. Nguyên tắc quan trọng:
                                750x422 pixel; .jpg, .jpeg, .gif hoặc .png. không có văn bản trên
                                hình ảnh
                            </p>

                            <label className="flex gap-3 cursor-pointer">
                                <div className="flex-1 px-4 py-2 border border-gray-300 rounded bg-gray-50">
                                    {courseImage ? "Đã chọn file" : "Chưa có file được chọn"}
                                </div>
                                <div className="px-6 flex items-center justify-center bg-primary text-white rounded hover:bg-primary/80 cursor-pointer whitespace-nowrap">
                                    {!courseImage ? "Tải file lên" : "Đổi"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        hidden
                                        ref={imageInputRef}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold mb-2">Video quảng cáo</h2>

                    <div className="flex gap-6">
                        <div className="w-1/2 border h-[260px] border-gray-300 rounded flex items-center justify-center bg-gray-50">
                            {promoVideo ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <p className="w-[80%]">
                                        Lưu các thay đổi để hoàn tất việc tải lên tệp của bạn.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="flex justify-center gap-4 mb-4">
                                        <svg
                                            className="w-24 h-24 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1"
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <svg
                                            className="w-24 h-24 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">Chưa có video được tải lên</p>
                                </div>
                            )}
                        </div>

                        {/* Right box - Upload instructions */}
                        <div className="w-1/2">
                            <p className="text-gray-700 mb-4">
                                Video quảng cáo của bạn là cách nhanh chóng và hấp dẫn để học viên
                                xem trước những gì họ sẽ học trong khóa học của bạn.
                            </p>

                            <label className="flex gap-3 cursor-pointer">
                                <div className="flex-1 px-4 py-2 border border-gray-300 rounded bg-gray-50">
                                    {promoVideo ? "Đã chọn file" : "Chưa có file được chọn"}
                                </div>
                                <div className="px-6 flex items-center justify-center bg-primary text-white rounded hover:bg-primary/80 cursor-pointer whitespace-nowrap">
                                    {!promoVideo ? "Tải file lên" : "Đổi"}
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        hidden
                                        ref={videoInputRef}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Giá khóa học</h3>
                    <div className="flex gap-4 mt-1">
                        <div>
                            <div>Tiền tệ</div>
                            <div className="px-3 py-2 rounded border border-gray-300 mt-1">VND</div>
                        </div>
                        <div>
                            <label htmlFor="price">Giá</label>
                            <input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                maxLength={52}
                                placeholder="Nhập giá khóa học"
                                className="border mt-1 px-3 py-2 border-gray-300 rounded w-full focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default CourseInfo;
