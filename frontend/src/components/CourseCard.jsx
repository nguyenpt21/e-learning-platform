
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// dùng như này: <CourseCard course={course} />
export default function CourseCard({ course, isInSlider = false }) {
  return (
    <div
      onClick={()=>{}}
      className={`${
        isInSlider ? "" : "w-[330px] h-[300px]"
      }  rounded-lg text-left`}
    >
      <div className="bg-white border border-gray-200 rounded-lg">
        <img
          src={course?.thumbnail?.publicURL}
          alt={course.title}
          className="w-full h-36 object-cover rounded-t-lg"
        />
        <div className="px-3 xl:px-5 py-2 xl:py-3">
          <h3 className="text-sm font-semibold line-clamp-2">{course.title}</h3>
          <p className="text-xs text-gray-600 truncate mt-1">{course.subtitle}</p>
          <div className="flex items-center gap-1 text-xs mt-1">
            <span className="text-yellow-500">{course?.avarageRating || 0}</span>
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-gray-500">
              ({course?.reviews || 0})
            </span>
          </div>
          <p className="text-sm font-semibold mt-1">{course.price.toLocaleString("vi-vn")} ₫</p>
          {course.level ? (
            <span className="inline-block font-semibold mt-2 text-xs px-2 py-1 bg-[#cee8fb] text-[#098be4] rounded">
              {course.level}
            </span>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      </div>
    </div>
  );
}

