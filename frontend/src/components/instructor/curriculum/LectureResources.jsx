import { useState } from "react";
import { IoClose } from "react-icons/io5";
const LectureResources = ({handleClose}) => {
    const [activeTab, setActiveTab] = useState("file");
    const [file, setFile] = useState(null);
    const [externalTitle, setExternalTitle] = useState("");
    const [externalUrl, setExternalUrl] = useState("");

    return (
        <div className="border-r border-l border-b rounded-b border-gray-300 bg-white p-2">
            <div className="border-b mb-4 flex gap-2">
                {[
                    { key: "file", label: "Downloadable File" },
                    { key: "external", label: "External Resource" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        className={`py-2 font-medium ${
                            activeTab === tab.key
                                ? "border-b-2 border-primary text-primary"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
                <button
                    className="p-1 hover:bg-gray-200 rounded ml-auto h-fit"
                    onClick={handleClose}
                >
                    <IoClose size={20}></IoClose>
                </button>
            </div>

            {activeTab === "file" && (
                <div>
                    <label className="flex items-center gap-4 mt-4 cursor-pointer">
                        <div className="flex-1 border rounded px-3 py-[6px] text-gray-500">
                            {file ? file.name : "Chưa có file được chọn"}
                        </div>
                        <div className="px-4 py-[6px] bg-primary text-white rounded cursor-pointer">
                            Chọn file
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                hidden
                            />
                        </div>
                    </label>
                    <p className="text-[10px] text-gray-500 mt-2">
                        <strong>Chủ thích:</strong> Tài nguyên có thể là bất kỳ loại tài liệu nào có
                        thể được sử dụng để trợ giúp sinh viên trong bài giảng.Đảm bảo mọi thứ đều
                        dễ đọc và kích thước tệp nhỏ hơn 1 GiB
                    </p>
                </div>
            )}

            {activeTab === "external" && (
                <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                        <label>Tiêu đề</label>
                        <input
                            type="text"
                            placeholder="Nhập tiêu đề mô tả"
                            value={externalTitle}
                            onChange={(e) => setExternalTitle(e.target.value)}
                            className="border border-gray-300 rounded w-full p-2"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/resource"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            className="border border-gray-300 rounded w-full p-2"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureResources;
