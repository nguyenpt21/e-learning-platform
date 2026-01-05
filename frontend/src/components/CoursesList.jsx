import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import Slider from "react-slick";
import Button from "./Button";
import CourseCard from "./CourseCard";
import { useGetCourseSearchResultsQuery } from "@/redux/api/coursePublicApiSlice";
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation, useCheckFavoriteQuery } from "@/redux/api/favoriteApiSlice";
import { toast } from "react-toastify";

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

function FavoriteButton({ courseId, onAddToFavorite, onRemoveFromFavorite, isAddLoading, isRemoveLoading }) {
  const { data: favoriteData, isLoading: isChecking } = useCheckFavoriteQuery(courseId, {
    skip: !courseId,
  });
  const isFavorite = favoriteData?.isFavorite || false;
  const isLoading = isAddLoading || isRemoveLoading;

  if (!courseId) return null;

  const handleClick = (e) => {
    if (isFavorite) {
      onRemoveFromFavorite(e, courseId);
    } else {
      onAddToFavorite(e, courseId);
    }
  };

  return (
    <Button
      variant={isFavorite ? "outline" : "reverse"}
      className="w-full mt-2 flex items-center justify-center gap-2"
      onClick={handleClick}
      disabled={isLoading || isChecking}
    >
      {isLoading ? (
        isFavorite ? "Đang xóa..." : "Đang thêm..."
      ) : isFavorite ? (
        <>
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          Đã thêm vào yêu thích
        </>
      ) : (
        <>
          <Heart className="w-4 h-4" />
          Thêm vào yêu thích
        </>
      )}
    </Button>
  );
}

export default function CoursesList() {
  const [activeTab, setActiveTab] = useState("Lập trình");
  const tabs = [
    "Lập trình",
    "Kinh doanh",
    "Thiết kế",
    "Tiếp thị",
    "CNTT & Phần mềm",
    "Phát triển cá nhân",
    "Nhiếp ảnh",
    "Âm nhạc",
  ];

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
    setCoursePopUp(courses[index] || null);
  };

  const leavePopUp = () => {
    setPopUpLeave(true); // Set to true when leaving the popup
    setCardLeave(true); // Set to true when leaving the card
  };

  const { data: result } = useGetCourseSearchResultsQuery({
    q: "",
    courseDuration: "",
    level: "",
    category: activeTab,
    language: "",
    selectedPrices: "",
    sort: "default",
    page: 0,
    limit: 8,
  });
  const courses = result?.results || [];
  const handleAllCourseByCategory = () =>{
    window.location.href = `/courses?q=&category=${encodeURIComponent(activeTab)}`;
  }

  const filteredCourses =
    Array.isArray(courses) && courses.length > 0
      ? courses.filter((c) => c?.category === activeTab)
      : [];
  const sliderRef = useRef(null);
  
  // Favorite functionality
  const [addToFavorites, { isLoading: isAddingFavorite }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemovingFavorite }] = useRemoveFromFavoritesMutation();
  
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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <div className="py-12">
      <div className="font-bold text-3xl mx-20 my-5 px-6">
        Tất cả các kỹ năng bạn cần đều có tại một nơi
      </div>
      <div className="text-lg text-gray-800/50 mx-20 my-5 px-6">
        Từ các kỹ năng quan trọng đến các chủ đề kỹ thuật, NewZLearn hỗ trợ sự
        phát triển chuyên môn của bạn.
      </div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-300 text-gray-700 font-medium mx-20 px-2 xl:px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.slickGoTo(0); // reset về slide đầu
              }
              setActiveTab(tab);
            }}
            className={`pb-2 text-sm xl:text-base px-2 cursor-pointer ${
              activeTab === tab
                ? "border-b-2 border-[#098be4] text-[#098be4] font-bold"
                : "hover:text-[#098be4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Course Carousel*/}
      <div className="py-5 px-20 bg-gray-100 ">
        {filteredCourses.length > 0 ? (
          <Slider
            className={"overflow-visible bg-none"}
            ref={sliderRef}
            {...settings}
          >
            {filteredCourses.map((course, index) => (
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
        ) : (
          <div className="w-full items-center justify-center flex flex-col gap-2 h-[300px]">
            <img src="/empty-course.png" alt="No courses" className="w-20 h-20 opacity-50" />
            <p className="text-[1.1rem] text-gray-500">Không có khóa học nào.</p>
          </div>
        )}

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
                  {coursePopUp?.learningOutcomes?.map((outcome, idx) => {return(
                    <li key={idx}>{outcome}</li>
                  )})}
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

        <Button variant="outline" className="mt-5 mx-2" onClick={handleAllCourseByCategory}>
          Hiển thị toàn bộ khóa học {activeTab}
        </Button>
      </div>
    </div>
  );
}
