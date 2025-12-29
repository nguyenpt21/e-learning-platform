"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteCourseCard from "@/components/student/courses-catalog/FavoriteCourseCard";
import { useState } from "react";
import { HeartOff } from "lucide-react";

export default function WishlistPage() {
  const [favorites, setFavorites] = useState([
    {
      _id: "1",
      title: "React từ cơ bản đến nâng cao",
      subtitle: "Học React bài bản",
      price: 499000,
      level: "Beginner",
      averageRating: 4.8,
      reviews: 120,
      thumbnail: {
        publicURL:
          "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      },
    },
    {
      _id: "2",
      title: "Node.js & Express Backend",
      subtitle: "Xây dựng REST API",
      price: 399000,
      level: "Intermediate",
      averageRating: 4.6,
      reviews: 90,
      thumbnail: {
        publicURL:
          "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },
    },
     {
      _id: "3",
      title: "Node.js & Express Backend",
      subtitle: "Xây dựng REST API",
      price: 399000,
      level: "Intermediate",
      averageRating: 4.6,
      reviews: 90,
      thumbnail: {
        publicURL:
          "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },
    },
     {
      _id: "4",
      title: "Node.js & Express Backend",
      subtitle: "Xây dựng REST API",
      price: 399000,
      level: "Intermediate",
      averageRating: 4.6,
      reviews: 90,
      thumbnail: {
        publicURL:
          "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },
    },
  ]);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* TITLE */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              Danh sách yêu thích
            </h1>
            <span className="text-sm text-gray-500">
              {favorites.length} khóa học
            </span>
          </div>

          {/* EMPTY STATE */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <HeartOff className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                Bạn chưa có khóa học yêu thích nào
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Hãy khám phá và thêm khóa học bạn quan tâm vào danh sách yêu thích
              </p>
            </div>
          ) : (
            /* GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((course) => (
                <FavoriteCourseCard
                  key={course._id}
                  course={course}
                  onRemove={removeFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
