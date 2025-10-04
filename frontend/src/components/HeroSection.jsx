// Hero.jsx
import { Star } from "lucide-react";
import Button from "./Button";

export default function HeroSection() {
    const handleExploreCourses = () => {}
  return (
    <section className="w-full bg-white h-full py-16">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <p className="uppercase tracking-wider text-gray-600 font-semibold">
            Ưu đãi đặc biệt dành cho học viên
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
          Tận hưởng hơn{" "}
            <span className="text-[#098be4] font-extrabold">1,2 nghìn khóa học</span> <br />
            dành cho người sáng tạo{" "}
            <span className="text-green-600 font-extrabold">miễn phí</span>
          </h1>
          <Button variant="reverse" onClick={handleExploreCourses}>
          Khám phá các gói khóa học
          </Button>
        </div>

        {/* Right content */}
        <div className="relative mt-10 lg:mt-0">
          {/* Background accent */}
          <div className="absolute -top-6 -left-6 bg-blue-100 rounded-lg -z-10"></div>

          {/* Image */}
          <img
            src="https://eduma.thimpress.com/demo-online-learning/wp-content/uploads/sites/104/2024/07/banner-learning.png"
            alt="Student"
            className="rounded-lg w-[500px] h-[500px] bg-blue-300"
          />

          {/* Rating badge */}
          <div className="absolute bottom-4 left-4 bg-white shadow-md rounded-lg px-4 py-2 flex items-center space-x-3">
            <span className="flex items-center bg-yellow-400 text-white font-bold px-2 py-1 rounded">
              <Star className="mr-1" /> 4.85
            </span>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Đánh giá trung bình</span> <br />
              183,406 đánh giá từ học viên
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
