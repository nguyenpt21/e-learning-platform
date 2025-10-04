import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Pensive-Tesla",
    students: "1,2k Student",
    avatar: "https://eduma.thimpress.com/demo-online-learning/wp-content/uploads/sites/104/2024/07/testimonial-01-60x60.png",
    feedback:
      "Khóa học rất thú vị. Tôi thích sự yên tĩnh của toàn bộ nội dung. Tôi đã học được rất nhiều về cách sử dụng màu sắc. Xanh lá không chỉ đơn thuần là xanh lá và trắng không chỉ đơn thuần là trắng. Cảm ơn!",
    rating: 5,
  },
  {
    id: 2,
    name: "Pensive-Tesla",
    students: "1,2k Student",
    avatar: "https://eduma.thimpress.com/demo-online-learning/wp-content/uploads/sites/104/2024/07/testimonial-02-60x60.png",
    feedback:
    "Tui khuyên mọi người nên học NewZLearn nếu muốn nâng cao kỹ năng. Nếu bạn đang trên thị trường việc làm, bạn có thể muốn bổ sung một kỹ năng mới hoặc tìm cho mình một con đường mới.",
    rating: 5,
  },
  {
    id: 3,
    name: "Pensive-Tesla",
    students: "1,2k Student",
    avatar: "https://eduma.thimpress.com/demo-online-learning/wp-content/uploads/sites/104/2024/07/testimonial-03-60x60.png",
    feedback:
      "Các khóa học NewZLearn luôn thú vị và nhiều thông tin. Chúng đưa lớp học đến ngay bên bạn và dẫn bạn vào hành trình khám phá những ý tưởng mới và những chủ đề hấp dẫn.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-gray-500 uppercase font-semibold">
        Học viên nói
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-blue-500">Sự hài lòng</span>{" "}
          <span className="text-black">luôn hiện hữu</span>
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4 mb-10">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[#f0f2f8] p-6 rounded-xl shadow-sm relative"
          >
            {/* Avatar + Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{t.name}</h3>
                <p className="text-gray-500 text-sm">{t.students}</p>
              </div>
             
            </div>
            <div className="w-full border-t border-white border-2 my-5"></div>

            {/* Feedback */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {t.feedback}
            </p>

            {/* Rating */}
            <div className="flex text-yellow-500">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center font-bold text-lg">
      Hơn 10.000 sinh viên tin tưởng và theo học tại NewZLearn
      </div>
    </section>
  );
}
