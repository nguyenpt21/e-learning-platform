import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import React, { useMemo } from 'react'
import { ChevronDown } from 'lucide-react';
import { useGetItemsProgressQuery } from '@/redux/api/progressApiSlice';
import { useParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner';
import { MdOutlineOndemandVideo } from "react-icons/md";
import { PiPuzzlePieceBold } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";

const formatDuration = (s) => {
    if (!s || isNaN(s)) return '00:00'
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return (h ? [h, m, sec] : [m, sec]).map(v => String(v).padStart(2, '0')).join(':')
}

const SectionsAccordion = ({ sections, handleChangeItem }) => {
    const params = useParams();
    const { data: itemsProgress, isLoading: isProgressLoading } = useGetItemsProgressQuery(params._id)

    const sectionsWithComputedData = useMemo(() => {
        const completedItemIds = new Set(
            itemsProgress?.filter(p => p.isCompleted).map(p => p.itemId) || []
        );
        return sections.map(section => {
            const totalItems = section.curriculumItems?.length || 0;
            const totalDuration = section.curriculumItems?.reduce((sum, item) => {
                const duration = item?.content?.duration || 0;
                return sum + duration;
            }, 0) || 0;
            const completedItems = section.curriculumItems?.filter(item =>
                completedItemIds.has(item._id)
            ).length || 0;
            return {
                ...section, totalItems, totalDuration, completedItems
            };
        });
    }, [sections, itemsProgress]);

    if (isProgressLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-12" color="#098ce9" />
            </div>
        );
    }

    const handleChange = (itemId, itemType) => {
        handleChangeItem(itemId, itemType);
    }

    return (
        <div>
            <div className='px-5 py-4 text-[15px] font-semibold border border-gray-200'>
                Nội dung bài học
            </div>
            <Accordion type="multiple" className="w-full border border-l-gray-200">
                {sectionsWithComputedData.map((section, idx) => {
                    return (
                        <AccordionItem key={section._id} value={`section-${idx}`}>
                            <AccordionTrigger className="group cursor-pointer px-5 py-4 bg-gray-50 hover:bg-gray-100 [&>svg]:hidden">
                                <div className="flex-1">
                                    <div className="font-semibold text-left text-[16px]">
                                        {idx + 1}. {section.title}
                                    </div>
                                    <div className="text-[13px] text-gray-500 mt-2 text-left">
                                        {section.completedItems} / {section.totalItems} bài học | {formatDuration(section.totalDuration)}
                                    </div>
                                </div>
                                <div>
                                    <ChevronDown className="text-gray-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="cursor-pointer">
                                {section.curriculumItems?.map((item, indx) => {
                                    const isCompleted = itemsProgress?.some(
                                        p => p.itemId === item._id && p.isCompleted === true
                                    ) || false;

                                    return (
                                        <div
                                            key={item._id}
                                            className="grid grid-cols-8 border-b py-3 px-4 items-center hover:bg-gray-100 duration-300"
                                            onClick={() => {
                                                if (item.itemType === "Lecture"){
                                                    handleChange(item._id, "Lecture")
                                                }
                                                else handleChange(item._id, "Quiz")
                                            }}
                                        >
                                            <div className="text-sm col-span-7">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="text-gray-600">
                                                        {indx + 1}. {item.title}
                                                    </span>
                                                </div>
                                                {item.itemType === "Lecture" ? (
                                                    <span className="flex items-center gap-2 text-xs text-gray-400">
                                                        {item.type === "video" ? (
                                                            <MdOutlineOndemandVideo className="w-4 h-4" />
                                                        ) : (
                                                            <IoDocumentTextOutline className="w-4 h-4" />
                                                        )}
                                                        {formatDuration(item?.content?.duration)}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-xs text-gray-400">
                                                        <PiPuzzlePieceBold className="w-4 h-4" />
                                                        {item.questions.length} câu
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-span-1 ml-auto flex justify-center">
                                                {isCompleted && <FaCircleCheck className='text-green-600 w-4 h-4' />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

export default SectionsAccordion;