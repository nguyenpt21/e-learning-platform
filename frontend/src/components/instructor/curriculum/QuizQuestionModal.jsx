import React, { useState, useRef, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const QuizQuestionModal = ({
    open,
    onOpenChange,
    initialData = null,
    onSave,
    mode = "create", // 'create' or 'edit'
}) => {
    const [answers, setAnswers] = useState(
        initialData?.answers || [
            { text: "", explanation: "", isCorrect: false },
            { text: "", explanation: "", isCorrect: false },
            { text: "", explanation: "", isCorrect: false },
        ]
    );
    const [question, setQuestion] = useState(initialData?.question || "");
    const [activeEditor, setActiveEditor] = useState(null);
    const quillRef = useRef(null);
    // Reset form when modal opens with new data
    useEffect(() => {
        if (open) {
            if (initialData) {
                setQuestion(initialData.question || "");
                setAnswers(
                    initialData.answers || [
                        { text: "", explanation: "", isCorrect: false },
                        { text: "", explanation: "", isCorrect: false },
                        { text: "", explanation: "", isCorrect: false },
                    ]
                );
            } else {
                setQuestion("");
                setAnswers([
                    { text: "", explanation: "", isCorrect: false },
                    { text: "", explanation: "", isCorrect: false },
                    { text: "", explanation: "", isCorrect: false },
                ]);
            }
            setActiveEditor(null);
        }
    }, [open, initialData]);

    useEffect(() => {
        if (activeEditor && quillRef.current) {
            // Use setTimeout to ensure ReactQuill is fully rendered
            setTimeout(() => {
                const editor = quillRef.current.getEditor();
                if (editor) {
                    editor.focus();
                    // Move cursor to end of content
                    const length = editor.getLength();
                    editor.setSelection(length, 0);
                }
            }, 0);
        }
    }, [activeEditor]);

    const addAnswer = () => {
        const newAnswer = {
            text: "",
            explanation: "",
            isCorrect: false,
        };
        setAnswers([...answers, newAnswer]);
    };

    const removeAnswer = (index) => {
        if (answers.length > 2) {
            const newAnswers = answers.filter((_, i) => i !== index);
            setAnswers(newAnswers);

            if (activeEditor && activeEditor.startsWith(`answer-${index}`)) {
                setActiveEditor(null);
            }
        }
    };

    const updateAnswer = (index, field, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = {
            ...newAnswers[index],
            [field]: value,
        };
        setAnswers(newAnswers);
    };

    const setCorrectAnswer = (index) => {
        const newAnswers = answers.map((answer, i) => ({
            ...answer,
            isCorrect: i === index,
        }));
        setAnswers(newAnswers);
    };

    const handleSave = () => {
        const data = {
            question,
            answers,
        };
        if (onSave) {
            onSave(data);
        }
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            ["code-block"],
        ],
    };

    const handleEditorClick = (editorId) => {
        setActiveEditor(editorId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        {mode === "edit" ? "Sửa câu hỏi" : "Tạo câu hỏi mới"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">Câu hỏi</label>

                        <div
                            onClick={() => handleEditorClick(`question`)}
                            className="rounded-[6px] focus-within:ring-blue-500 focus-within:ring-1 transition-colors "
                        >
                            <ReactQuillNew
                                ref={quillRef}
                                value={question}
                                onChange={setQuestion}
                                modules={{
                                    toolbar: [
                                        ["bold", "italic", "underline"],
                                        ["code-block"],
                                        ["link", "image"],
                                    ],
                                }}
                                placeholder="Nhâp câu hỏi..."
                                className=""
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold mb-3">Câu trả lời</label>

                        {answers.map((answer, index) => (
                            <div key={answer.id} className="mb-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={answer.isCorrect}
                                        onChange={() => setCorrectAnswer(index)}
                                        className="mt-4 w-5 h-5 cursor-pointer"
                                    />

                                    <div className="flex-1">
                                        <div
                                            
                                        >
                                            {activeEditor === `answer-${index}` ? (
                                                <div
                                                    className="rounded-[6px] focus-within:ring-blue-500 focus-within:ring-1 transition-colors"
                                                >
                                                    <ReactQuillNew
                                                        ref={quillRef}
                                                        value={answer.text}
                                                        onChange={(value) =>
                                                            updateAnswer(index, "text", value)
                                                        }
                                                        modules={modules}
                                                        placeholder="Nhập câu trả lời."
                                                        className="quiz-answer-editor"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        handleEditorClick(`answer-${index}`)
                                                    }
                                                    className={`min-h-[60px] p-3 border rounded-md cursor-text hover:border-gray-400 transition-colors border-gray-300
                                                       `}
                                                >
                                                    {answer.text.replace(/<(.|\n)*?>/g, "").trim()
                                                        .length > 0 ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: answer.text,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            Nhập câu trả lời.
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className="mt-2 ml-4"
                                        >
                                            {activeEditor === `explanation-${index}` ? (
                                                <div className="rounded-[6px] focus-within:ring-blue-500 focus-within:ring-1 transition-colors">
                                                    <ReactQuillNew
                                                        ref={quillRef}
                                                        value={answer.explanation}
                                                        onChange={(value) =>
                                                            updateAnswer(
                                                                index,
                                                                "explanation",
                                                                value
                                                            )
                                                        }
                                                        modules={modules}
                                                        placeholder="Giải thích tại sao đây là câu trả lời tốt nhất hoặc sai."
                                                        className="quiz-explanation-editor"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        handleEditorClick(`explanation-${index}`)
                                                    }
                                                    className="p-3 border border-gray-300 rounded-md cursor-text hover:border-gray-400 transition-colors text-sm"
                                                >
                                                    {answer.explanation
                                                        .replace(/<(.|\n)*?>/g, "")
                                                        .trim().length > 0 ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: answer.explanation,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            Giải thích tại sao đây là câu trả lời tốt nhất hoặc sai.
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeAnswer(index)}
                                        disabled={answers.length <= 2}
                                        className={`mt-4 p-2 rounded ${
                                            answers.length <= 2
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Answer Button */}
                        <button
                            onClick={addAnswer}
                            className="mt-2 px-4 py-2 text-blue-600 hover:bg-primary/5 rounded-md font-medium transition-colors"
                        >
                            + Thêm câu trả lời
                        </button>
                    </div>
                </div>

                <DialogFooter>
                    <button
                        onClick={handleCancel}
                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/70 font-medium"
                    >
                        {mode === "edit" ? "Sửa câu hỏi" : "Lưu câu hỏi"}
                    </button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
};

// Demo component to show usage
export default QuizQuestionModal;
