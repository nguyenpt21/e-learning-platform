import React, { useState, useRef, useEffect } from "react";
import { Trash2, X, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LectureQuestionModal = ({
    open,
    onOpenChange,
    initialData = null,
    itemId,
    questionId,
    onAddQuestion = () => { },
    onUpdateQuestion = () => { },
}) => {
    const defaultOption = { optionText: "", textExplanation: "", isCorrect: false };

    const [options, setOptions] = useState([
        { ...defaultOption },
        { ...defaultOption },
    ]);
    const [questionText, setQuestion] = useState("");
    const [timestamp, setTimestamp] = useState(0); // Lưu số giây (Number)
    const [activeEditor, setActiveEditor] = useState(null);
    const quillRef = useRef(null);
    const [showConfirmZeroTime, setShowConfirmZeroTime] = useState(false);

    const modules = {
        toolbar: [["bold", "italic", "underline"], ["code-block"]],
    };

    useEffect(() => {
        if (open) {
            if (initialData) {
                setQuestion(initialData.questionText || "");
                setOptions(initialData.options && initialData.options.length > 0
                    ? initialData.options
                    : [{ ...defaultOption }, { ...defaultOption }]
                );
                setTimestamp(Number(initialData.displayedAt) || 0);
            } else {
                setQuestion("");
                setOptions([{ ...defaultOption }, { ...defaultOption }]);
                setTimestamp(0);
            }
            setActiveEditor(null);
        }
    }, [open, initialData]);

    useEffect(() => {
        if (activeEditor && quillRef.current) {
            setTimeout(() => {
                const editor = quillRef.current.getEditor();
                if (editor) {
                    editor.focus();
                    const length = editor.getLength();
                    editor.setSelection(length, 0);
                }
            }, 0);
        }
    }, [activeEditor]);

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, { ...defaultOption }]);
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
            if (activeEditor && activeEditor.startsWith(`option-${index}`)) {
                setActiveEditor(null);
            }
        }
    };

    const updateOption = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const setCorrectOption = (index) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index,
        }));
        setOptions(newOptions);
    };

    const handleSave = () => {
        const stripHtml = (html) => (html ? html.replace(/<[^>]*>?/gm, "") : "");

        if (!questionText || stripHtml(questionText).trim() === "") {
            toast.error("Nhập nội dung câu hỏi trước khi lưu");
            return;
        }

        if (typeof timestamp !== 'number' || timestamp < 0) {
            toast.error("Thời gian không hợp lệ");
            return;
        }
        if (timestamp === 0) {
            setShowConfirmZeroTime(true);
            return;
        }

        if (options.length < 2) {
            toast.error("Cần ít nhất 2 câu trả lời");
            return;
        }

        const hasCorrectAnswer = options.some((option) => option.isCorrect);
        if (!hasCorrectAnswer) {
            toast.error("Hãy chọn một câu trả lời đúng");
            return;
        }

        const emptyOptions = options.filter(
            (option) => !option.optionText || stripHtml(option.optionText).trim() === ""
        );

        if (emptyOptions.length > 0) {
            toast.error("Vui lòng điền nội dung cho tất cả các lựa chọn");
            return;
        }

        handleConfirmSave();
    };

    const handleConfirmSave = () => {
        const question = {
            questionText,
            displayedAt: timestamp, // số giây
            options,
        };

        if (!initialData) {
            onAddQuestion({ itemId, data: question });
        } else {
            if (questionId) onUpdateQuestion({ itemId, questionId, data: question });
        }

        onOpenChange(false);
    }

    const handleEditorClick = (editorId) => {
        setActiveEditor(editorId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        {initialData ? "Sửa câu hỏi" : "Tạo câu hỏi mới"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <label className="block font-semibold mb-2">Câu hỏi</label>
                            <div
                                onClick={() => handleEditorClick(`questionText`)}
                                className="rounded-[6px] focus-within:ring-blue-500 focus-within:ring-1 transition-colors"
                            >
                                <ReactQuillNew
                                    ref={quillRef}
                                    value={questionText}
                                    onChange={setQuestion}
                                    modules={{
                                        toolbar: [
                                            ["bold", "italic", "underline"],
                                            ["code-block"],
                                            ["link", "image"],
                                        ],
                                    }}
                                    placeholder="Nhập câu hỏi..."
                                />
                            </div>
                        </div>

                        <div className="w-40">
                            <label className="block font-semibold mb-2">Thời điểm xuất hiện</label>

                            <TimeInput
                                value={timestamp}
                                onChange={(seconds) => setTimestamp(seconds)}
                            />
                            <p className="text-[10px] text-gray-500 mt-1 text-center">Giờ : Phút : Giây</p>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold mb-3">
                            Các lựa chọn (Tối đa 4)
                        </label>

                        {options.map((option, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="radio"
                                        name="correctOption"
                                        checked={option.isCorrect}
                                        onChange={() => setCorrectOption(index)}
                                        className="mt-4 w-5 h-5 cursor-pointer"
                                    />

                                    <div className="flex-1">
                                        <div className="mb-2">
                                            {activeEditor === `option-${index}` ? (
                                                <div className="rounded-[6px] focus-within:ring-blue-500 focus-within:ring-1 transition-colors">
                                                    <ReactQuillNew
                                                        ref={quillRef}
                                                        value={option.optionText}
                                                        onChange={(value) => updateOption(index, "optionText", value)}
                                                        modules={modules}
                                                        placeholder="Nhập câu trả lời"
                                                        className="quiz-option-editor"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => handleEditorClick(`option-${index}`)}
                                                    className="min-h-[60px] p-3 border rounded-md cursor-text hover:border-gray-400 transition-colors border-gray-300"
                                                >
                                                    {option.optionText && option.optionText.replace(/<[^>]+>/g, '').trim().length > 0 ? (
                                                        <div dangerouslySetInnerHTML={{ __html: option.optionText }} />
                                                    ) : (
                                                        <span className="text-gray-400">Nhập câu trả lời.</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4">
                                            {activeEditor === `explanation-${index}` ? (
                                                <div className="rounded-[6px] focus-within:ring-blue-500 focus-within:ring-1 transition-colors">
                                                    <ReactQuillNew
                                                        ref={quillRef}
                                                        value={option.textExplanation || ""}
                                                        onChange={(value) => updateOption(index, "textExplanation", value)}
                                                        modules={modules}
                                                        placeholder="Giải thích lý do đúng/sai"
                                                        className="quiz-explanation-editor"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => handleEditorClick(`explanation-${index}`)}
                                                    className="p-3 border border-gray-300 rounded-md cursor-text hover:border-gray-400 transition-colors text-sm"
                                                >
                                                    {option.textExplanation && option.textExplanation.replace(/<[^>]+>/g, '').trim().length > 0 ? (
                                                        <div dangerouslySetInnerHTML={{ __html: option.textExplanation }} />
                                                    ) : (
                                                        <span className="text-gray-400">Giải thích tại sao đây là câu trả lời tốt nhất hoặc sai.</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeOption(index)}
                                        disabled={options.length <= 2}
                                        className={`mt-4 p-2 rounded ${options.length <= 2
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-500 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {options.length < 4 && (
                            <button
                                onClick={addOption}
                                className="mt-2 px-4 py-2 text-blue-600 hover:bg-primary/5 rounded-md font-medium transition-colors"
                            >
                                + Thêm câu trả lời
                            </button>
                        )}
                    </div>
                </div>

                <ConfirmZeroTimestampDialog
                    open={showConfirmZeroTime}
                    onConfirm={handleConfirmSave}
                    onCancel={() => setShowConfirmZeroTime(false)}
                />

                <DialogFooter>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/70 font-medium"
                    >
                        {initialData ? "Sửa câu hỏi" : "Lưu câu hỏi"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ConfirmZeroTimestampDialog = ({ open, onConfirm, onCancel }) => {
    return (
        <AlertDialog open={open} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Xác nhận thời điểm xuất hiện
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn đang đặt thời điểm xuất hiện là <b>00:00</b>.
                        Câu hỏi sẽ hiển thị ngay khi video bắt đầu.
                        Bạn có chắc chắn muốn lưu?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Xác nhận
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};



const TimeInput = ({ value = 0, onChange }) => {
    const hourRef = useRef(null);
    const minRef = useRef(null);
    const secRef = useRef(null);

    const [displayHour, setDisplayHour] = useState("0");
    const [displayMin, setDisplayMin] = useState("0");
    const [displaySec, setDisplaySec] = useState("0");

    useEffect(() => {
        const safeValue = isNaN(value) ? 0 : value;

        const hours = Math.floor(safeValue / 3600);
        const mins = Math.floor((safeValue % 3600) / 60);
        const secs = safeValue % 60;

        setDisplayHour(hours.toString());
        setDisplayMin(mins.toString());
        setDisplaySec(secs.toString());
    }, [value]);

    const updateParent = (h, m, s) => {
        const hours = parseInt(h === "" ? 0 : h);
        const mins = parseInt(m === "" ? 0 : m);
        const secs = parseInt(s === "" ? 0 : s);

        const totalSeconds = (hours * 3600) + (mins * 60) + secs;
        onChange(totalSeconds);
    };


    const handleHourChange = (e) => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 2); // Tối đa 2 số
        setDisplayHour(val);
        updateParent(val, displayMin, displaySec);

        if (val.length === 2) minRef.current?.focus();
    };

    const handleMinChange = (e) => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 2);
        setDisplayMin(val);
        updateParent(displayHour, val, displaySec);

        if (val.length === 2) secRef.current?.focus();
    };

    const handleSecChange = (e) => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 2);
        setDisplaySec(val);
        updateParent(displayHour, displayMin, val);
    };

    const handleBlur = () => {
        if (displayHour === "") { setDisplayHour("0"); updateParent("0", displayMin, displaySec); }
        if (displayMin === "") { setDisplayMin("0"); updateParent(displayHour, "0", displaySec); }
        if (displaySec === "") { setDisplaySec("0"); updateParent(displayHour, displayMin, "0"); }
    };

    const handleKeyDown = (e, type) => {
        if (e.key === "Backspace" && !e.target.value) {
            if (type === "sec") minRef.current?.focus();
            if (type === "min") hourRef.current?.focus();
        }
    };

    return (
        <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all w-full">
            {/* Giờ */}
            <input
                ref={hourRef}
                type="text"
                value={displayHour}
                onChange={handleHourChange}
                onBlur={handleBlur}
                placeholder="0"
                className="w-full text-center outline-none border-none p-0 bg-transparent font-mono text-gray-700"
            />
            <span className="mx-0.5 font-bold text-gray-400 select-none">:</span>

            {/* Phút */}
            <input
                ref={minRef}
                type="text"
                value={displayMin}
                onChange={handleMinChange}
                onKeyDown={(e) => handleKeyDown(e, "min")}
                onBlur={handleBlur}
                placeholder="0"
                className="w-full text-center outline-none border-none p-0 bg-transparent font-mono text-gray-700"
            />
            <span className="mx-0.5 font-bold text-gray-400 select-none">:</span>

            {/* Giây */}
            <input
                ref={secRef}
                type="text"
                value={displaySec}
                onChange={handleSecChange}
                onKeyDown={(e) => handleKeyDown(e, "sec")}
                onBlur={handleBlur}
                placeholder="0"
                className="w-full text-center outline-none border-none p-0 bg-transparent font-mono text-gray-700"
            />
        </div>
    );
};

export default LectureQuestionModal