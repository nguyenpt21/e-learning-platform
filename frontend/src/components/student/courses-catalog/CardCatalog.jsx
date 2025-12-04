"use client"

import { useState } from "react"
import { Star, Check, Heart } from "lucide-react"

export function CardCatalog({ course, index, columns = 3 }) {
  const [popUp, setPopUp] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [width, setWidth] = useState(300)

  const formatPrice = (price) => `₫${price.toLocaleString()}`

  // card nằm ở cột phải => popup mở sang trái
  const isRightEdge = (index + 1) % columns === 0

  const onEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCoords({
      x: rect.left,
      y: rect.top,
    })
    setWidth(rect.width)
    setPopUp(true)
  }

  const onLeave = () => {
    setPopUp(false)
  }

  return (
    <div
      className="relative w-full group cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* MAIN CARD */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg hover:scale-105 transition-transform duration-300 h-full flex flex-col">
        <img
          src={course?.thumbnail?.publicURL || "/logo.png"}
          alt={course.title}
          className="w-full h-36 object-cover rounded-t-lg"
        />

        <div className="px-5 py-3 flex flex-col flex-1 space-y-1">
          <h3 className="text-base font-semibold line-clamp-2 group-hover:text-[#098be4]">
            {course.title}
          </h3>

          <p className="text-xs text-gray-600">
            {course.description.replace(/<[^>]+>/g, "").slice(0, 110)}
            {course.description.replace(/<[^>]+>/g, "").length > 110 && "..."}
          </p>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-yellow-500">{course.averageRating}</span>
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold group-hover:text-[#098be4]">
              {formatPrice(course.price)}
            </span>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popUp && (
        <div
          className="absolute top-0 z-50"
          style={{
            top: "-10px",
            left: isRightEdge ? `calc(-100% - 25px)` : `calc(100% + 25px)`,
            width: width,
            background: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          {/* MŨI TÊN */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              ...(isRightEdge
                ? {
                  right: "-10px",
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "10px solid white",
                }
                : {
                  left: "-10px",
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderRight: "10px solid white",
                }),
            }}
          />

          <p className="text-sm xl:text-base font-semibold">{course.title}</p>

          <div className="flex items-center space-x-2 h-6 my-2">
            {course.badge && (
              <span className="font-semibold text-xs px-2 py-1 bg-[#cee8fb] text-[#098be4] rounded">
                {course.badge}
              </span>
            )}
            <span className="text-xs py-1 italic max-w-1/2">
              Cập nhật:{" "}
              {(course.updatedAt
                ? new Date(course.updatedAt)
                : new Date()
              ).toLocaleDateString("vi")}
            </span>
          </div>

          <p className="text-xs text-gray-700 leading-5">
            {course.description.replace(/<[^>]+>/g, "").slice(0, 250)}
            {course.description.replace(/<[^>]+>/g, "").length > 250 && "..."}
          </p>

          {course.learningOutcomes?.length > 0 && (
            <ul className="list-disc text-xs/5 text-gray-800 space-y-2 px-5 mt-3">
              {course.learningOutcomes.slice(0, 3).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          <button className="mt-4 w-full bg-[#098be4] text-white py-2 rounded hover:bg-[#087ac7] transition">
            Thêm vào giỏ hàng
          </button>
        </div>
      )}
    </div>
  )
}