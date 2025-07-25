"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  Bookmark,
  Share2
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/atoms/visuals/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/molecules/navigation/tabs";
import { CommentSection } from "@/components/organisms/content/comment-section";
import { getFullImageUrl } from "@/lib/utils";
import { API_BASE } from "@/lib/config";
import { Recipe } from "@/lib/type";

export default function RecipeDetail() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useUser();
  const [isNotFound, setIsNotFound] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const saveRecipe = async (
    userId: string,
    recipeId: string,
    method: "POST" | "DELETE"
  ): Promise<boolean> => {
    try {
      const url =
        method === "POST"
          ? `${API_BASE}/api/saved-recipes/`
          : `${API_BASE}/api/saved-recipes/remove`;

      const res = await fetch(url, {
        method: "POST", // always POST since /remove is also a POST route now
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, recipeId })
      });

      return res.ok;
    } catch (error) {
      console.error("Error saving/removing recipe:", error);
      return false;
    }
  };

  const handleSave = async () => {
    const method = isSaved ? "DELETE" : "POST"; // logical toggle
    const result = await saveRecipe(user?.id || "unknown", id, method);
    if (result) {
      setIsSaved(!isSaved); // toggle state on success
    }
  };

  useEffect(() => {
    const getRecipeById = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/recipes/${id}`);
        if (!res.ok) {
          setIsNotFound(true);
          return;
        }

        const data: Recipe = await res.json();
        setRecipe(data);

        if (user?.id) {
          const checkRes = await fetch(`${API_BASE}/api/saved-recipes?userId=${user?.id}&recipeId=${recipe?.id}`)
          const saved = await checkRes.json();
          setIsSaved(saved.length > 0); // ✅ Adjust depending on what API returns
        }
      } catch (err) {
        setIsNotFound(true);
      }
    };
    if (id) getRecipeById();
  }, [id, user?.id]);
    
  const handleRating = (rating: number) => setUserRating(rating);

  if (isNotFound) {
    notFound();
  }
  if (!recipe) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to recipes
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={getFullImageUrl(recipe.imageUrl) || "/placeholder.svg"}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handleSave}>
                <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"}/>
                <span className="sr-only">Save recipe</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share recipe</span>
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{recipe.description}</p>
          <div className="flex items-center mt-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-medium">
                {recipe.rating?.toFixed(1) ?? "0.0"}
              </span>
              {/* Hiện số lượt đánh giá nếu có */}
              <span className="ml-2 text-sm text-gray-500">
                ({recipe.ratingCount ?? 0} đánh giá)
              </span>
            </div>
            <span className="mx-2 text-gray-300">|</span>
            <span>By {recipe.author}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Prep Time</span>
              <span className="font-medium">{recipe.prepTime} minutes</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Cook Time</span>
              <span className="font-medium">{recipe.cookTime} minutes</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
              <Users className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Servings</span>
              <span className="font-medium">{recipe.servings}</span>
            </div>
          </div>
          {/* ĐÃ XOÁ PHẦN RATE BÊN NGOÀI, CHỈ ĐỂ LẠI Ở COMMENT-SECTION */}
        </div>
      </div>
      <Tabs defaultValue="ingredients" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients" className="mt-6">
            {`${recipe.ingredients}`}
        </TabsContent>
        <TabsContent value="instructions" className="mt-6">
            {`${recipe.instructions}`}
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Add a comment</h3>
          </div>
          <CommentSection recipeId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}