import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Slider from "react-slick";
import Button from "./Button";
import CourseCard from "./CourseCard";

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

export default function CoursesList() {
  const [activeTab, setActiveTab] = useState("Khoa Học Dữ Liệu");
  const tabs = [
    "Khoa Học Dữ Liệu",
    "Chứng Chỉ CNTT",
    "Khả Năng Lãnh Đạo",
    "Phát Triển Web",
    "Giao Tiếp",
    "Phân Tích Nghiệp Vụ & Nghiệp Vụ Thông Minh",
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

  const courses = [
    {
      id: 1,
      category: "Khoa Học Dữ Liệu",
      title: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 2,
      category: "Khoa Học Dữ Liệu",
      title: "ChatGPT: Complete ChatGPT Course For Work 2025 (Ethically)!",
      author: "Steve Ballinger, MBA",
      rating: 4.5,
      reviews: 120536,
      price: "₫1,349,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5061666_b32b_6.jpg",
    },
    {
      id: 3,
      category: "Khoa Học Dữ Liệu",
      title: "ChatGPT, DeepSeek, Grok and 30+ More AI Marketing Assistants",
      author:
        "Anton Voroniuk, Anton Voroniuk Support, Eugene Voroniuk, Eugene Vyborov, ",
      rating: 4.4,
      reviews: 978,
      price: "₫399,000",
      badge: null,
      img: "https://img-c.udemycdn.com/course/480x270/5231088_b1e8_2.jpg",
    },
    {
      id: 4,
      category: "Khoa Học Dữ Liệu",
      title: "ChatGPT & Generative AI - The Complete Guide",
      author:
        "Academind by Maximilian Schwarzmüller, Maximilian Schwarzmüller, Manuel Lorenz",
      rating: 4.6,
      reviews: 26716,
      price: "₫1,679,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5291332_4a58_7.jpg",
    },
    {
      id: 5,
      category: "Khoa Học Dữ Liệu",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 6,
      category: "Khoa Học Dữ Liệu",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 7,
      category: "Khoa Học Dữ Liệu",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 8,
      category: "Khoa Học Dữ Liệu",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 9,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 10,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 11,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 12,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 13,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 14,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 15,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
    {
      id: 16,
      category: "Chứng Chỉ CNTT",
      title:
        "Hướng dẫn AI đầy đủ: Tìm hiểu ChatGPT, AI tạo sinh và nhiều hơn nữa",
      author: "Julian Melanson, Benza Maman, Leap Year Learning",
      rating: 4.5,
      reviews: 53435,
      price: "₫1,779,000",
      badge: "Bán chạy",
      img: "https://img-c.udemycdn.com/course/480x270/5170404_d282_9.jpg",
    },
  ];
  const filteredCourses = courses.filter((c) => c.category === activeTab);
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
      <div className="py-12 px-20 bg-gray-100 ">
        <Slider
          className={"overflow-visible bg-none"}
          ref={sliderRef}
          {...settings}
        >
          {filteredCourses.map((course, index) => (
            <Button
              onMouseEnter={(e) => enterPopUp(e, index)}
              onMouseLeave={leavePopUp}
              key={course.id}
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
                {coursePopUp.badge && (
                  <span className="font-semibold text-xs px-2 py-1 bg-[#cee8fb] text-[#098be4] rounded max-w-1/2">
                    {coursePopUp.badge}
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
                <p>
                  Master Data Science and AI: Learn Python, EDA, Stats, SQL,
                  Machine Learning, NLP, Deep Learning and Gen AI
                </p>
                <ul className="list-disc  px-6 ">
                  <li>
                    Xây dựng nền tảng vững chắc về lập trình Python để triển
                    khai hiệu quả các khái niệm và ứng dụng AI.
                  </li>
                  <li>Tìm hiểu cách thức hoạt động của Học máy và Học sâu</li>
                  <li>
                    Tìm hiểu cách các mô hình biến đổi cách mạng hóa các tác vụ
                    NLP và cách tận dụng chúng cho nhiều ứng dụng khác nhau.
                  </li>
                </ul>
              </div>

              <Button variant="reverse" className="w-full mt-2">
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        )}

        <Button variant="outline" className="mt-5 mx-2">
          Hiển thị toàn bộ khóa học {activeTab}
        </Button>
      </div>
    </div>
  );
}
