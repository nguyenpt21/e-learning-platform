import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Slider from "react-slick";
import Button from "./Button";
import CourseCard from "./CourseCard";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-2 z-10 hover:bg-gray-200"
      style={{ ...style }}
    >
      <ChevronRight className="w-6 h-6"/>
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-2 z-10 hover:bg-gray-200"
      style={{ ...style }}
    >
      <ChevronLeft className="w-6 h-6"/>
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
      <div className="flex gap-6 border-b border-gray-300 text-gray-700 font-medium mx-20 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.slickGoTo(0); // reset về slide đầu
              }
              setActiveTab(tab);
            }}
            className={`pb-2 px-2 cursor-pointer ${
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
        <Slider className={"overflow-visible"} ref={sliderRef} {...settings}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} isInSlider={true}/>
          ))}
        </Slider>

        <Button variant="outline" className="mt-5 mx-2">
          Hiển thị toàn bộ khóa học {activeTab}
        </Button>
      </div>
    </div>
  );
}
