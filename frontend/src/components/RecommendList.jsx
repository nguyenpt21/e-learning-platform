import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import CourseCard from "./CourseCard";
import Slider from "react-slick";
import FavoriteButton from "./student/home-page/FavoriteButton";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "@/redux/api/favoriteApiSlice";
import { useGetRecommendCoursesQuery } from "@/redux/api/courseApiSlice";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center absolute right-[15px] top-1/2 translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-2 z-10 hover:bg-gray-200"
      style={{ ...style }}
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center absolute left-[15px] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-2 z-10 hover:bg-gray-200"
      style={{ ...style }}
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}

function RecommendList() {
  const {userInfo} = useSelector((state) => state.auth);
  const { data } = useGetRecommendCoursesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const rcmdList = data?.map(item => item.course);
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const [popUp, setPopUp] = useState(-1);
  const [cardLeave, setCardLeave] = useState(false);
  const [popUpLeave, setPopUpLeave] = useState(true);
  useEffect(() => {
    if (cardLeave && popUpLeave) {
      setPopUp(-1);
    }
  }, [cardLeave, popUpLeave]);
  const [coursePopUp, setCoursePopUp] = useState(null);
  const [popUpCoords, setPopUpCoords] = useState({ x: 0, y: 0 });
  const [popUpWidth, setPopUpWidth] = useState(300); // default width
  const enterPopUp = (e, index) => {
    setPopUp(index);
    setPopUpLeave(false);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopUpCoords({ x: rect.left, y: 250 });
    setPopUpWidth(rect.width);
    setCoursePopUp(rcmdList[index] || null);
  };

  const leavePopUp = () => {
    setPopUpLeave(true); // Set to true when leaving the popup
    setCardLeave(true); // Set to true when leaving the card
  };

  // Favorite functionality
  const [addToFavorites, { isLoading: isAddingFavorite }] =
    useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemovingFavorite }] =
    useRemoveFromFavoritesMutation();

  const handleAddToFavorite = async (e, courseId) => {
    e.stopPropagation();
    try {
      await addToFavorites(courseId).unwrap();
      toast.success("Đã thêm vào yêu thích");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Lỗi khi thêm vào yêu thích");
    }
  };

  const handleRemoveFromFavorite = async (e, courseId) => {
    e.stopPropagation();
    try {
      await removeFromFavorites(courseId).unwrap();
      toast.success("Đã xóa khỏi yêu thích");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Lỗi khi xóa khỏi yêu thích");
    }
  };
  if (rcmdList?.length === 0 || !userInfo?._id) return null;
  return (
    <div className="py-8">
      <div className="font-bold text-3xl mx-20 my-5 px-6">Bạn có thể thích</div>
      <div className="text-lg text-gray-800/50 mx-20 my-5 px-6">
        Từ những khóa học bạn vừa xem và tìm kiếm gần đây.
      </div>
      <div className="py-5 px-20 bg-gray-100 ">
        <Slider
          className={"overflow-visible bg-none"}
          ref={sliderRef}
          {...settings}
        >
          {rcmdList?.map((course, index) => (
            <Button
              onMouseEnter={(e) => enterPopUp(e, index)}
              onMouseLeave={leavePopUp}
              key={course._id || course.id}
              className="flex justify-start bg-white/0 hover:bg-white/0 items-start hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <CourseCard course={course} isInSlider={true} />
            </Button>
          ))}
        </Slider>
        {popUp !== -1 && (
          <div
            style={{
              position: "fixed",
              top: popUpCoords.y - 20,
              left:
                popUp % 4 == 3
                  ? popUpCoords.x - popUpWidth
                  : popUpCoords.x + popUpWidth,
              width: popUpWidth,
              height: "auto", // equivalent to h-40
              backgroundColor: "white",
              zIndex: 999,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // equivalent to shadow-lg
              borderRadius: "0.5rem", // equivalent to rounded-lg
              padding: "1rem",
              opacity: popUp === -1 ? 0 : 1,
              transform: popUp === -1 ? "scale(0.5)" : "scale(1)",
              transition:
                "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setPopUpLeave(false)}
            onMouseLeave={() => setPopUpLeave(true)}
          >
            {/* mũi tên */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                ...(popUp % 4 === 3
                  ? {
                      // popup ở bên trái -> mũi tên sang phải
                      right: "-10px",
                      borderTop: "12px solid transparent",
                      borderBottom: "12px solid transparent",
                      borderLeft: "12px solid white",
                    }
                  : {
                      // popup ở bên phải -> mũi tên sang trái
                      left: "-10px",
                      borderTop: "12px solid transparent",
                      borderBottom: "12px solid transparent",
                      borderRight: "12px solid white",
                    }),
              }}
            ></div>
            <div>
              <p className="text-sm xl:text-base font-semibold">
                {coursePopUp.title}
              </p>
              <div className="flex space-x-2 w-full items-center h-8 ">
                {coursePopUp.level && (
                  <span className="font-semibold text-xs px-2 py-1 bg-[#cee8fb] text-[#098be4] rounded max-w-1/2">
                    {coursePopUp.level}
                  </span>
                )}
                <p className="text-xs py-1 italic max-w-1/2">
                  Cập nhật:{" "}
                  {(coursePopUp.updatedAt
                    ? new Date(coursePopUp.updatedAt)
                    : new Date()
                  ).toLocaleDateString("vi")}
                </p>
              </div>

              <div className="text-xs/5 text-gray-800 py-2 space-y-2">
                <p>{coursePopUp?.subtitle}</p>
                <ul className="list-disc  px-6 ">
                  {coursePopUp?.learningOutcomes?.map((outcome, idx) => {
                    return <li key={idx}>{outcome}</li>;
                  })}
                </ul>
              </div>

              <FavoriteButton
                courseId={coursePopUp?._id}
                onAddToFavorite={handleAddToFavorite}
                onRemoveFromFavorite={handleRemoveFromFavorite}
                isAddLoading={isAddingFavorite}
                isRemoveLoading={isRemovingFavorite}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendList;
