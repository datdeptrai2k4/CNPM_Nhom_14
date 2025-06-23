"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Button } from "@/components/atoms/visuals/button";
import { Card } from "@/components/atoms/layout/card";

const featuredRecipes = [
  {
    id: "1",
    title: "Banh Mi Saigon",
    description:
      "Bánh mì with grilled pork, pickled vegetables, and fresh herbs.",
    rating: 4.9,
    author: "PizzaMaster",
    image: "/images/BanhMi.jpg?height=400&width=600",
  },
  {
    id: "2",
    title: "Bún Bò Huế",
    description: "Spicy beef noodle soup with lemongrass and chili oil.",
    rating: 4.8,
    author: "GourmetChef",
    image: "/images/bunbohue.jpg?height=400&width=600",
  },
  {
    id: "3",
    title: "Cơm Tấm",
    description:
      "Broken rice with grilled pork, pickled vegetables, and fried egg.",
    rating: 4.7,
    author: "SpiceExpert",
    image: "/images/ComTam.jpg?height=400&width=600",
  },
];

export function FeaturedRecipes() {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="rounded-xl"
      >
        {featuredRecipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <Card className="overflow-hidden">
              <div className="relative h-[400px]">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
                  <p className="mb-2">{recipe.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="ml-1">{recipe.rating.toFixed(1)}</span>
                      <span className="ml-2">By {recipe.author}</span>
                    </div>
                    <Link href={`/recipes/${recipe.id}`}>
                      <Button variant="secondary" size="sm">
                        View Recipe
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
