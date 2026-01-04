import React, { useState, useRef, useEffect } from "react";
import LectureQuestionModal from "@/components/instructor/curriculum/LectureQuestionModal";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { useAddLectureQuestionMutation, useGetLectureQuestionsQuery, useUpdateLectureQuestionMutation, useDeleteLectureQuestionMutation } from "@/redux/api/lectureQuestionApiSlice";
import { toast } from "react-toastify";
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

const LectureQuestion = ({ itemId, sectionId, courseId }) => {
    const { data: questions } = useGetLectureQuestionsQuery(itemId, {
        skip: !itemId,
        selectFromResult: ({ data }) => ({
            data: data ? data.questions : [],
        }),
    });

    const [addQuestion] = useAddLectureQuestionMutation();
    const [updateQuestion] = useUpdateLectureQuestionMutation();
    const [deleteQuestion] = useDeleteLectureQuestionMutation();

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleAddQuestion = async (newQuestion) => {
        setIsQuestionModalOpen(false);
        try {
            const res = await addQuestion({
                lectureId: itemId,
                question: newQuestion.data,
            }).unwrap();
            toast.success("Câu hỏi đã được thêm thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm câu hỏi:", error);
            toast.error("Đã xảy ra lỗi khi thêm câu hỏi.");
        }
    }

    const handleUpdateQuestion = async (updatedQuestion) => {
        try {
            const res = await updateQuestion({
                lectureId: itemId,
                questionId: updatedQuestion.questionId,
                question: updatedQuestion.data,
            }).unwrap();
            toast.success("Câu hỏi đã được cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật câu hỏi:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật câu hỏi.");
        }
        setEditingQuestion(null);
        setIsQuestionModalOpen(false);
    }

    const requestDelete = (questionId) => {
        setDeleteId(questionId);
        setIsAlertOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteQuestion({
                lectureId: itemId,
                questionId: deleteId,
            }).unwrap();
            toast.success("Câu hỏi đã được xóa thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa câu hỏi:", error);
            toast.error("Đã xảy ra lỗi khi xóa câu hỏi.");
        } finally {
            setIsAlertOpen(false);
            setDeleteId(null);
        }
    }

    const containerRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const isBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

        setIsAtBottom(isBottom);
    };

    const scrollToBottom = () => {
        const el = containerRef.current;
        if (!el) return;

        el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        setIsAtBottom(false);
    }, [questions.length]);

    return (
        <div className="border-t border-t-gray-200 mt-2">
            <div className='flex items-center my-2'>
                <p className="px-2 font-semibold">Câu hỏi trong bài giảng</p>
                <button
                    className='px-3 py-1 text-sm font-semibold border rounded text-primary cursor-pointer hover:bg-primary/10'
                    onClick={() => {
                        setEditingQuestion(null);
                        setIsQuestionModalOpen(true);
                    }}
                >
                    Thêm câu hỏi
                </button>
            </div>
            <LectureQuestionModal
                open={isQuestionModalOpen}
                onOpenChange={setIsQuestionModalOpen}
                itemId={itemId}
                questionId={editingQuestion?._id}
                initialData={editingQuestion}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
            />

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Câu hỏi này sẽ bị xóa vĩnh viễn khỏi bài giảng.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {questions.length === 0 ? (
                <p className="text-sm text-gray-500 ml-2 mb-2">Chưa có câu hỏi nào được thêm vào bài giảng này.</p>
            ) : (
                <div className="relative">
                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="relative max-h-[100px] overflow-y-auto pr-1 pl-2 mb-2"
                    >
                        {questions.map((question, index) => (
                            <Question
                                key={question._id}
                                question={question}
                                index={index}
                                sectionId={sectionId}
                                onEdit={() => {
                                    setEditingQuestion(question);
                                    setIsQuestionModalOpen(true);
                                }}
                                onDelete={() => requestDelete(question._id)}
                            />
                        ))}
                    </div>

                    {questions.length > 3 && !isAtBottom && (
                        <>
                            {!isAtBottom && (
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white/90 to-transparent" />
                            )}
                            <button
                                onClick={scrollToBottom}
                                className={` absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-500 bg-transparent
                                transition-all duration-200
                                ${isAtBottom
                                        ? "opacity-0 pointer-events-none"
                                        : "opacity-100 hover:text-gray-800"}
                            `}
                            >
                                Cuộn để xem thêm ↓
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

const stripHtml = (html = "") => {
    return html.replace(/<[^>]*>/g, "").trim();
};

const Question = ({ question, index, sectionId, onEdit, onDelete }) => {
    const [isHoveredQuestion, setIsHoveredQuestion] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHoveredQuestion(true)}
            onMouseLeave={() => setIsHoveredQuestion(false)}
            className="flex items-center justify-between"
        >
            <div className="flex gap-1 mt-2">
                <span className="font-semibold mr-1">{index + 1}.</span>
                <div>
                    {stripHtml(question.questionText)}
                </div>
            </div>
            <div className={`flex items-center ${isHoveredQuestion ? "opacity-100" : "opacity-0"}`}>
                <button
                    className="p-1.5 hover:bg-gray-200 rounded"
                    onClick={onEdit}
                >
                    <LuPencil size={14} className="" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1.5 hover:bg-gray-200 rounded"
                >
                    <FaRegTrashAlt size={14} className="" />
                </button>
            </div>
        </div>
    );
}


export default LectureQuestion