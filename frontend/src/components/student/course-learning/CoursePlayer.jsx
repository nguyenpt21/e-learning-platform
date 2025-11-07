import { useGetCurriculumItemByIdQuery } from "@/redux/api/coursePublicApiSlice";
import React, { useRef, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import parse, { domToReact } from "html-react-parser";
import { IoBook } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import VideoPlayer from "@/components/student/course-learning/VideoPlayer";
import Quiz from "@/components/student/course-learning/Quiz";
import NoteModal from "@/components/student/course-learning/NoteModal";
import {
  useGetItemProgressQuery,
  useUpdateItemProgressMutation,
} from "@/redux/api/progressApiSlice";
import { useDispatch } from "react-redux";
import { openAddNoteModal } from "@/redux/features/notesSlice";

const quillToText = (quillContent) => {
  if (!quillContent) return null;

  return parse(quillContent, {
    replace: (domNode) => {
      const { name, children, attribs } = domNode;
      if (!name) return;
      switch (name) {
        case "h1":
          return (
            <h1 className="html-h1 text-3xl font-bold mb-4">
              {domToReact(children)}
            </h1>
          );
        case "h2":
          return (
            <h2 className="html-h2 text-2xl font-semibold mb-3">
              {domToReact(children)}
            </h2>
          );
        case "h3":
          return (
            <h3 className="html-h3 text-xl font-semibold mb-2">
              {domToReact(children)}
            </h3>
          );
        case "p":
          return <p className="my-5">{domToReact(children)}</p>;
        case "ul":
          return (
            <ul className="list-disc ml-6 mb-2 html-content">
              {domToReact(children)}
            </ul>
          );
        case "ol":
          return (
            <ol className="list-decimal ml-6 mb-2 html-content">
              {domToReact(children)}
            </ol>
          );
        case "li":
          return <li className="mb-1">{domToReact(children)}</li>;
        case "strong":
        case "b":
          return <strong>{domToReact(children)}</strong>;
        case "em":
        case "i":
          return <em>{domToReact(children)}</em>;
        case "u":
          return <u>{domToReact(children)}</u>;
        case "a":
          return (
            <a
              href={attribs?.href || "#"}
              target={attribs?.target || "_blank"}
              rel={attribs?.rel || "noopener noreferrer"}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {domToReact(children)}
            </a>
          );
        case "img":
          return (
            <img
              src={attribs?.src}
              alt={attribs?.alt || ""}
              className="my-4 max-w-full rounded"
            />
          );
        default:
          return undefined;
      }
    },
  });
};

const formatDuration = (s) => {
  if (!s || isNaN(s)) return "00:00";
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  return (h ? [h, m, sec] : [m, sec])
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

const CoursePlayer = ({ itemId, itemType, onDoneChange }) => {
  const dispatch = useDispatch();
  const { data: item, isLoading: isItemLoading } =
    useGetCurriculumItemByIdQuery(
      { itemId, itemType },
      { skip: !itemId || !itemType }
    );
  const { data: itemProgress, isLoading: isProgressLoading } =
    useGetItemProgressQuery(
      {
        courseId: item?.courseId,
        sectionId: item?.sectionId,
        itemId: item?._id,
      },
      { skip: !item || !item?._id, refetchOnMountOrArgChange: true }
    );
  const [updateProgress] = useUpdateItemProgressMutation();
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleAddNote = () => {
    // Tạm dừng video 
    videoRef.current?.pause();

    dispatch(
      openAddNoteModal({
        timestamp: currentTime,
        itemId: itemId,
        courseId: item?.courseId,
      })
    );
  };

  useEffect(() => {
    setIsDone(itemProgress?.isCompleted);
  }, [itemProgress]);
  useEffect(() => {
    if (onDoneChange) {
      onDoneChange(isDone);
    }
  }, [isDone, onDoneChange]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTime(Math.floor(videoRef.current.getCurrentTime()));
      }
      // console.log(videoRef.current.getCurrentTime(), "-", videoRef.current.getDuration())
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!item || !videoRef.current) return;

    const currentVideo = videoRef.current;
    let hasSavedInitialProgress = false;
    let hasSavedCompletion = false;
    let interval = null;

    const handleSaveProgress = async () => {
      const watchedSeconds =
        currentVideo.getCurrentTime?.() || itemProgress?.watchedSeconds || 0;
      if (watchedSeconds < (itemProgress?.watchedSeconds || 0)) return;
      const totalSeconds =
        currentVideo.getDuration?.() || itemProgress?.totalSeconds || 0;
      const progressPercent = totalSeconds
        ? Math.round((watchedSeconds / totalSeconds) * 100)
        : 0;
      try {
        const res = await updateProgress({
          courseId: item.courseId,
          sectionId: item.sectionId,
          itemId: item._id,
          itemType: "video",
          watchedSeconds,
          totalSeconds,
          progressPercent,
        }).unwrap();
        // console.log("Progress video saved:", res);
      } catch (err) {
        console.error("Update video failed:", err);
      }
    };
    const saveInitialProgress = async () => {
      if (!hasSavedInitialProgress) {
        hasSavedInitialProgress = true;
        await handleSaveProgress();
      }
    };
    saveInitialProgress();
    interval = setInterval(() => {
      if (!videoRef.current) return;
      const watchedSeconds = videoRef.current.getCurrentTime?.() || 0;
      const totalSeconds = videoRef.current.getDuration?.() || 0;
      const progressPercent = totalSeconds
        ? Math.round((watchedSeconds / totalSeconds) * 100)
        : 0;
      if (
        !hasSavedCompletion &&
        progressPercent >= 85 &&
        watchedSeconds >= (itemProgress?.watchedSeconds || 0)
      ) {
        hasSavedCompletion = true;
        setIsDone(true);
        handleSaveProgress();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      handleSaveProgress();
    };
  }, [item?._id, itemProgress, updateProgress, videoRef]);

  if ((isItemLoading && !item) || (isProgressLoading && !itemProgress)) {
    return (
      <div className="px-4 md:px-12 lg:px-24 mt-12 space-y-4">
        <Skeleton className="h-10 w-3/5" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-[1px] w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
    );
  }

  if (!item || !itemId || !itemType) {
    return (
      <div className="px-4 md:px-12 lg:px-24 mt-12 space-y-4">
        <Skeleton className="h-10 w-3/5" />
        <p className="mt-4">Không tìm thấy nội dung bài học.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-grow">
        {itemType === "Lecture" ? (
          item.type === "article" ? (
            <ArticleRender
              item={item}
              itemProgress={itemProgress}
              setIsDone={setIsDone}
            />
          ) : (
            <div className="flex flex-col">
              <div className="w-full bg-black h-[45vh] md:h-[50vh] lg:h-[calc(58vh-3px)]">
                {item?.content?.publicURL ? (
                  <VideoPlayer
                    key={item._id + "_" + itemProgress?.watchedSeconds}
                    ref={videoRef}
                    videoUrl={item.content.publicURL}
                    onPlayStateChange={setIsPlaying}
                    startTime={itemProgress?.watchedSeconds}
                  />
                ) : (
                  <Skeleton className="w-full h-full" />
                )}
              </div>
              <div className=" mx-12 mt-8 md:mx-12 md:mt-12 lg:mx-20 lg:mt-12 overflow-auto">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="text-2xl lg:text-3xl font-semibold mb-1">
                    <p>{item.title}</p>
                    <span className="text-gray-500 text-sm font-normal">
                      Cập nhật{" "}
                      {new Date(item?.updatedAt).toLocaleDateString("vi-VN", {
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={handleAddNote}
                    className="flex-shrink-0 rounded-md bg-blue-100 hover:bg-blue-200 px-3 py-2 flex items-center justify-center transition-colors"
                  >
                    <MdAdd className="h-5 w-5" />
                    <p className="text-sm font-normal ml-2">
                      Thêm ghi chú tại{" "}
                      <span className="font-semibold">
                        {formatDuration(currentTime)}
                      </span>
                    </p>
                  </button>
                </div>
                <div className="py-5 text-gray-600">{item.description}</div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col">
            <div className="w-full border-b-2 border-b-gray-200 h-[45vh] md:h-[50vh] lg:h-[calc(58vh+3px)] overflow-y-auto">
              <Quiz
                item={item}
                setIsDone={setIsDone}
                itemProgress={itemProgress}
                isProgressLoading={isProgressLoading}
              />
            </div>
            <div className="mx-12 mt-8 md:mx-12 md:mt-12 lg:mx-20 lg:mt-12">
              <div className="text-2xl lg:text-3xl font-semibold mb-1">
                <p>{item.title}</p>
                <span className="text-gray-500 text-sm font-normal">
                  Cập nhật{" "}
                  {new Date(item?.updatedAt).toLocaleDateString("vi-VN", {
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* <NoteModal /> */}
      </div>

      <footer className="w-full text-sm text-center py-5 flex items-center justify-center">
        © {new Date().getFullYear()} <IoBook className="mx-3 text-blue-500" />{" "}
        Newzlearn
      </footer>
    </div>
  );
};

const ArticleRender = ({ item, itemProgress, setIsDone }) => {
  const articleRef = useRef(null);
  const [updateProgress] = useUpdateItemProgressMutation();
  const lastProgressRef = useRef(0);
  const saveTimeoutRef = useRef(null);
  const hasCompletedRef = useRef(false);

  const saveProgress = async (progressPercentToSave) => {
    if (!item) return;
    try {
      await updateProgress({
        courseId: item.courseId,
        sectionId: item.sectionId,
        itemId: item._id,
        itemType: "article",
        watchedSeconds: null,
        totalSeconds: null,
        progressPercent: progressPercentToSave,
      }).unwrap();
      // console.log("Article progress saved:", progressPercentToSave);

      if (
        progressPercentToSave >= 85 &&
        progressPercentToSave > itemProgress?.progressPercent
      ) {
        hasCompletedRef.current = true;
        setIsDone(true);
        // console.log("Article completed (>85%)");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const getProgressPercent = (container) => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    const denominator = scrollHeight - clientHeight;
    if (denominator <= 0) return 100;
    return Math.min(100, Math.round((scrollTop / denominator) * 100));
  };

  useEffect(() => {
    if (!articleRef.current || !itemProgress) return;
    const container = articleRef.current;
    const { progressPercent } = itemProgress;
    if (
      progressPercent > 0 &&
      container.scrollHeight > container.clientHeight
    ) {
      const scrollTop =
        ((container.scrollHeight - container.clientHeight) * progressPercent) /
        100;
      container.scrollTop = scrollTop;
    }
  }, [itemProgress]);

  useEffect(() => {
    if (!item || !articleRef.current) return;
    const container = articleRef.current;
    const initialProgress = itemProgress?.progressPercent || 0;
    saveProgress(initialProgress);
    lastProgressRef.current = initialProgress;

    const handleScroll = () => {
      const currentProgress = getProgressPercent(container);
      if (lastProgressRef.current >= 100) return;

      if (currentProgress > lastProgressRef.current) {
        lastProgressRef.current = currentProgress;

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          saveProgress(currentProgress);
        }, 800);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      const finalProgress = lastProgressRef.current;
      if (finalProgress > 0 && finalProgress > itemProgress?.progressPercent) {
        saveProgress(finalProgress);
      }
    };
  }, [item?._id, item.courseId, item.sectionId]);

  if (!itemProgress) {
    return (
      <div className="px-4 md:px-12 lg:px-24 mt-12 space-y-4">
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
    <div
      ref={articleRef}
      className="px-4 sm:px-8 md:px-12 lg:px-24 py-8 overflow-y-auto max-h-[90vh]"
    >
      <p className="text-2xl lg:text-3xl font-semibold mb-1">{item.title}</p>
      <span className="text-gray-600 text-sm">
        Cập nhật{" "}
        {new Date(item?.updatedAt).toLocaleDateString("vi-VN", {
          month: "2-digit",
          year: "numeric",
        })}
      </span>
      <div className="border-b border-gray-200 my-6"></div>
      <div className="mt-4">{quillToText(item.content?.text)}</div>
    </div>
  );
};

export default CoursePlayer;
