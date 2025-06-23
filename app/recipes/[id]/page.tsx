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

import { Button } from "@/components/atoms/visuals/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/molecules/navigation/tabs";
import { Textarea } from "@/components/atoms/form/textarea";
import { CommentSection } from "@/components/organisms/content/comment-section";
import { getFullImageUrl } from "@/lib/utils";
import { API_BASE } from "@/lib/config";
import { Recipe } from "@/lib/type";

export default function RecipeDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [isNotFound, setIsNotFound] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

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
      } catch (err) {
        setIsNotFound(true);
      }
    };

    if (id) getRecipeById();
  }, [id]);
  
  const handleRating = (rating: number) => setUserRating(rating);

  if (isNotFound) {
    notFound(); // triggers Next.js built-in 404 page
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
            src={getFullImageUrl(recipe.imageUrl)}
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
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
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
                {recipe.rating.toFixed(1)}
              </span>
            </div>
            <span className="mx-2 text-gray-300">|</span>
            <span>By {recipe.author}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Prep Time</span>
              <span className="font-medium">{recipe.prepTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Cook Time</span>
              <span className="font-medium">{recipe.cookTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
              <Users className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-sm text-gray-500">Servings</span>
              <span className="font-medium">{recipe.servings}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Rate this recipe</h3>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      userRating && rating <= userRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {userRating
                  ? `You rated this ${userRating} stars`
                  : "Click to rate"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ingredients" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients" className="mt-6">
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-3"></div>
                {ingredient}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="instructions" className="mt-6">
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-800 font-medium mr-3">
                  {index + 1}
                </span>
                <p>{instruction}</p>
              </li>
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Add a comment</h3>
            <Textarea
              placeholder="Share your thoughts or tips about this recipe..."
              className="mb-2"
            />
            <Button>Post Comment</Button>
          </div>
          <CommentSection recipeId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
