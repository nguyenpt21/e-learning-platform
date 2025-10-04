import React, { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineDragIndicator } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

const SortableItem = ({ id, value, placeholder, onChange, onDelete, canDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "#f9f9f9" : "white",
        display: "flex",
        borderRadius: "6px",
        marginBottom: "6px",
        width: "100%",
    };

    const [hover, setHover] = useState(false);
    const hasValue = value.trim().length > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="hover:bg-primary/5 w-[80%] border border-primary/20 p-2 rounded-md focus-within:border-primary">
                <input
                    value={value}
                    onChange={(e) => onChange(id, e.target.value)}
                    onFocus={() => setHover(true)}
                    onBlur={() => setHover(false)}
                    className="w-full placeholder:text-grayText/50"
                    placeholder={placeholder}
                />
            </div>
            {/* Drag handle */}
            {hover && hasValue && (
                <button
                    {...attributes}
                    {...listeners}
                    className="px-[10px] hover:bg-primary/5 text-lg border border-primary cursor-grab text-primary rounded-md"
                >
                    <MdOutlineDragIndicator />
                </button>
            )}
            {/* Delete button */}
            {hover && hasValue && (
                <button
                    onClick={() => canDelete && onDelete(id)}
                    disabled={!canDelete}
                    className={`${
                        canDelete ? "cursor-pointer" : "cursor-not-allowed"
                    } px-3 border border-primary rounded-md text-primary text-lg hover:bg-primary/5`}
                >
                    <FaRegTrashCan />
                </button>
            )}
        </div>
    );
};

const EditableList = ({ minItems = 1, placeholders, items, setItems }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };
    const handleChange = (id, value) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
    };

    const handleDelete = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const filledCount = items.filter((i) => i.value.trim() !== "").length;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item, index) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        value={item.value}
                        placeholder={placeholders[index % minItems]}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        canDelete={filledCount > minItems}
                    />
                ))}
            </SortableContext>
            <button
                disabled={filledCount < minItems}
                onClick={() => setItems((prev) => [...prev, { id: String(Date.now()), value: "" }])}
                className="text-primary font-medium mt-1 hover:cursor-pointer px-4 py-2 hover:bg-primary/20 rounded-md"
            >
                + Thêm câu trả lời
            </button>
        </DndContext>
    );
};

const CourseGoal = () => {
    const [outcomeLearning, setOutcomeLearning] = useState([
        { id: "1", value: "" },
        { id: "2", value: "" },
        { id: "3", value: "" },
        { id: "4", value: "" },
    ]);

    const outcomeLearningPlaceholders = [
        "Ví dụ: Xác định yêu cầu bài toán",
        "Ví dụ: Nắm được quy trình trong một dự án",
        "Ví dụ: Tìm hiểu case study thực tế",
        "Ví dụ: Mô phỏng lại dư án",
    ];

    const [requirements, setRequirements] = useState([{ id: "1", value: "" }]);

    const requirementsPlaceholders = [
        "Ví dụ: Không cần kinh nghiệm, bạn sẽ được học mọi thứ cần thiết",
    ];

    const [intendedLearners, setIntendedLearners] = useState([{ id: "1", value: "" }]);

    const intendedLearnersPlaceholders = [
        "Ví dụ: Những người có nhu cầu tìm hiểu về khoa học dữ liệu",
    ];

    return (
        <div>
            <div className="fixed w-full h-[50px] top-0 left-0"></div>
            <div>
                <h3 className="text-lg p-5 border-b border-b-grayText/20">Đối tượng học viên</h3>
                <div className="p-5 flex flex-col gap-5">
                    <div>
                        <p className="font-medium">Học viên sẽ học gì trong khóa học của bạn?</p>
                        <p className="mt-4 w-[80%]">
                            Bạn phải nhập ít nhất 4 mục tiêu học tập hoặc kết quả mà người học có
                            thể mong đợi đạt được sau khi hoàn thành khóa học của bạn.
                        </p>
                        <div className="mt-2 flex flex-col gap-2 items-start">
                            <EditableList
                                minItems={4}
                                placeholders={outcomeLearningPlaceholders}
                                items={outcomeLearning}
                                setItems={setOutcomeLearning}
                            ></EditableList>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">
                            Các yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học của bạn là
                            gì?
                        </p>
                        <p className="mt-4 w-[80%]">
                            Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị cần thiết trước
                            khi tham gia khóa học của bạn.
                        </p>
                        <div className="mt-2 flex flex-col gap-2 items-start">
                            <EditableList
                                placeholders={requirementsPlaceholders}
                                items={requirements}
                                setItems={setRequirements}
                            ></EditableList>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">Khóa học này giành cho ai?</p>
                        <p className="mt-4 w-[80%]">
                            Viết một mô tả rõ ràng về những người học dự định cho khóa học của bạn,
                            những người sẽ thấy nội dung khóa học của bạn có giá trị.
                        </p>
                        <div className="mt-2 flex flex-col gap-2 items-start">
                            <EditableList
                                placeholders={intendedLearnersPlaceholders}
                                items={intendedLearners}
                                setItems={setIntendedLearners}
                            ></EditableList>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseGoal;
