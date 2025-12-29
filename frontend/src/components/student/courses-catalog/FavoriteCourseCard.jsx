"use client";

import { Star, Heart } from "lucide-react";

export default function FavoriteCourseCard({ course, onRemove }) {
  return (
    <div className="w-[330px] h-[300px] bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* IMAGE */}
      <div className="relative">
        <img
          src={course?.thumbnail?.publicURL || "/logo.png"}
          alt={course.title}
          className="w-full h-36 object-cover"
        />

        {/*  REMOVE FROM FAVORITE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(course._id);
          }}
          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow
                     hover:scale-110 transition"
        >
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="px-3 xl:px-5 py-2 xl:py-3 text-left">
        <h3 className="text-sm font-semibold line-clamp-2">
          {course.title}
        </h3>

        <p className="text-xs text-gray-600 truncate mt-1">
          {course.subtitle}
        </p>

        <div className="flex items-center gap-1 text-xs mt-1">
          <span className="text-yellow-500">
            {course?.averageRating || 0}
          </span>
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span className="text-gray-500">
            ({course?.reviews || 0})
          </span>
        </div>

        <p className="text-sm font-semibold mt-1">
          {course.price.toLocaleString("vi-VN")} ₫
        </p>

        {course.level ? (
          <span className="inline-block font-semibold mt-2 text-xs px-2 py-1
                           bg-[#cee8fb] text-[#098be4] rounded">
            {course.level}
          </span>
        ) : (
          <div className="h-8" />
        )}
      </div>
    </div>
  );
}
