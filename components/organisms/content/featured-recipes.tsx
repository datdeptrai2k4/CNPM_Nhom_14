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
import { Skeleton } from "@/components/feedback/skeleton";
import { API_BASE } from "@/lib/config";
import { Recipe } from "@/lib/type";
import { mockedRecipes } from "@/lib/mocks/recipes";
import { useEffect, useState } from "react";

export function FeaturedRecipes() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>();

  const fetchFeaturedRecipes = async (): Promise<Recipe[]> => {
    const result = await fetch(`${API_BASE}/api/recipes/feature-recipe`);
    let data: Recipe[] = result.status === 404 ? [] : await result.json();

    if (data.length < 3 || result.status === 404) {
      const needed = 3 - data.length;
      const fallback = mockedRecipes.slice(0, needed);
      data = [...data, ...fallback];
    }

    return data;
  };

  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      const data = await fetchFeaturedRecipes();
      setFeaturedRecipes(data);
    };

    loadFeaturedRecipes();
  }, []);

  if (!featuredRecipes) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[240px] w-full rounded-t-md" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

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
                  src={recipe.imageUrl || "/placeholder.svg"}
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
                      <span className="ml-1">{recipe.rating?.toFixed(1) ?? "N/A"}</span>
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
