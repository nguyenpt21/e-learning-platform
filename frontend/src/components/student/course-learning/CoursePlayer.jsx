import { useGetCurriculumItemByIdQuery } from '@/redux/api/coursePublicApiSlice'
import React, { useRef, useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import parse, { domToReact } from 'html-react-parser';
import { IoBook } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import VideoPlayer from '@/components/student/course-learning/VideoPlayer';

const quillToText = (quillContent) => {
    if (!quillContent) return null;

    return parse(quillContent, {
        replace: (domNode) => {
            const { name, children, attribs } = domNode;
            if (!name) return;
            switch (name) {
                case 'h1': return <h1 className="html-h1 text-3xl font-bold mb-4">{domToReact(children)}</h1>;
                case 'h2': return <h2 className="html-h2 text-2xl font-semibold mb-3">{domToReact(children)}</h2>;
                case 'h3': return <h3 className="html-h3 text-xl font-semibold mb-2">{domToReact(children)}</h3>;
                case 'p': return <p className="my-5">{domToReact(children)}</p>;
                case 'ul': return <ul className="list-disc ml-6 mb-2 html-content">{domToReact(children)}</ul>;
                case 'ol': return <ol className="list-decimal ml-6 mb-2 html-content">{domToReact(children)}</ol>;
                case 'li': return <li className="mb-1">{domToReact(children)}</li>;
                case 'strong':
                case 'b': return <strong>{domToReact(children)}</strong>;
                case 'em':
                case 'i': return <em>{domToReact(children)}</em>;
                case 'u': return <u>{domToReact(children)}</u>;
                case 'a':
                    return (
                        <a
                            href={attribs?.href || '#'}
                            target={attribs?.target || '_blank'}
                            rel={attribs?.rel || 'noopener noreferrer'}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {domToReact(children)}
                        </a>
                    );
                case 'img':
                    return (
                        <img
                            src={attribs?.src} alt={attribs?.alt || ''}
                            className="my-4 max-w-full rounded"
                        />
                    );
                default:
                    return undefined;
            }
        }
    });
};

const formatDuration = (s) => {
    if (!s || isNaN(s)) return '00:00'
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return (h ? [h, m, sec] : [m, sec]).map(v => String(v).padStart(2, '0')).join(':')
}

const CoursePlayer = ({ itemId, itemType }) => {
    const { data: item, isLoading: isItemLoading } = useGetCurriculumItemByIdQuery(
        { itemId, itemType },
        { skip: !itemId || !itemType }
    );
    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current) {
                setCurrentTime(Math.floor(videoRef.current.getCurrentTime()));
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    if (isItemLoading || !item) {
        return (
            <div className="mx-24 mt-12 space-y-4">
                <Skeleton className="h-10 w-3/5" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-[1px] w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>
        );
    }

    return (
        <div className=''>
            {itemType === "Lecture" ? (
                item.type === "article" ? (
                    <ArticleRender item={item} />
                ) : (
                    <div className=''>
                        <div className="h-[60vh] w-full relative">
                            <VideoPlayer ref={videoRef} videoUrl={item?.content?.publicURL} />
                        </div>
                        <div className="px-24 py-12">
                            <div className='flex items-start justify-between'>
                                <div className='text-3xl font-semibold mb-1'>
                                    <p>{item.title}</p>
                                    <span className="text-gray-500 text-sm font-normal">
                                        Cập nhật {new Date(item?.updatedAt).toLocaleDateString("vi-VN", {
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <button className='rounded-md bg-blue-100 hover:bg-blue-200 px-3 py-2 flex items-center justify-center'>
                                    <MdAdd className='h-5 w-5' />
                                    <p className="text-sm font-normal">
                                        Thêm ghi chú tại <span className="font-semibold">{formatDuration(currentTime)}</span>
                                    </p>
                                </button>
                            </div>
                            <div className='py-5 text-gray-600'>{item.description}</div>
                        </div>
                    </div>
                )
            ) : (
                <div>/* nội dung Quiz */</div>
            )}
            <footer className="w-full text-sm text-center mt-18 mb-5 flex items-center justify-center">
                © {new Date().getFullYear()} <IoBook className='mx-3 text-blue-500' /> Newzlearn
            </footer>
        </div>
    )
}

const ArticleRender = ({ item }) => {
    return (
        <div className='mx-24 mt-12'>
            <p className='text-3xl font-semibold mb-1'>{item.title}</p>
            <span className="text-gray-600 text-sm">
                Cập nhật {new Date(item?.updatedAt).toLocaleDateString("vi-VN", {
                    month: "2-digit",
                    year: "numeric",
                })}
            </span>
            <div className='border-[0.5px] border-b-gray-300 my-8'></div>
            <div className='mt-4 '>
                {quillToText(item.content?.text)}
            </div>
        </div>
    )
}

export default CoursePlayer