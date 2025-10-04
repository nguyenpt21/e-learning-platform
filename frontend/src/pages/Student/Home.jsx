import { BookOpen, PlayCircle, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Học tập mọi lúc, mọi nơi cùng <span className="text-yellow-300">eLearning</span>
            </h1>
            <p className="mt-6 text-lg text-gray-100">
              Tham gia hàng ngàn khóa học trực tuyến với giảng viên uy tín và nội dung đa dạng.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow hover:bg-yellow-300 transition">
                Bắt đầu học ngay
              </button>
              <button className="px-6 py-3 border border-white rounded-xl hover:bg-white hover:text-indigo-600 transition">
                Khám phá khóa học
              </button>
            </div>
          </div>
          <div className="flex-1 mt-10 md:mt-0 flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/online-courses-tutorials_23-2148533383.jpg"
              alt="eLearning"
              className="w-80 md:w-[400px] rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Tại sao chọn chúng tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <BookOpen className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Khoá học đa dạng</h3>
            <p>Hàng ngàn khóa học từ CNTT, Marketing, Kinh doanh đến kỹ năng mềm.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <Users className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Giảng viên chất lượng</h3>
            <p>Đội ngũ giảng viên giàu kinh nghiệm, nhiệt tình và tận tâm.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <PlayCircle className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Học mọi lúc</h3>
            <p>Chủ động thời gian và địa điểm học với hệ thống trực tuyến 24/7.</p>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Khóa học nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Lập trình Web", "Digital Marketing", "Phân tích dữ liệu"].map((course, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
              >
                <img
                  src="https://img.freepik.com/free-vector/education-online-concept_23-2148509851.jpg"
                  alt={course}
                  className="rounded-xl mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{course}</h3>
                <p className="text-gray-600 mb-4">Khóa học chuyên sâu, phù hợp mọi trình độ.</p>
                <button className="flex items-center text-indigo-600 font-semibold hover:underline">
                  Xem chi tiết <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn sàng bắt đầu hành trình học tập của bạn?
        </h2>
        <button className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-xl shadow hover:bg-yellow-300 transition">
          Đăng ký ngay
        </button>
      </section>
    </div>
  );
}
