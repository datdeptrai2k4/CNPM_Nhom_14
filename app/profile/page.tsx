"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/atoms/visuals/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/molecules/navigation/tabs";
import { Recipe } from "@/lib/type";
import { ProfileHeader } from "./components/ProfileHeader";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeList } from "./components/RecipeList";

import { API_BASE } from "@/lib/config";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-recipes");
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [savedRecipeCount, setSavedRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingofSaved, setLoadingofSaved] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/api/recipes/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRecipes(data);
        setRecipeCount(data.length);
        setLoading(false);
      });

      fetch(`${API_BASE}/api/saved-recipes/user?userId=${user.id}`)
        .then((res) => res.json())
        .then(async (res: { recipeId: string }[]) => {
          const ids = res.map((r) => r.recipeId);

          // If no saved recipes
          if (ids.length === 0) {
            setSavedRecipes([]);
            setSavedRecipeCount(0);
            setLoadingofSaved(false);
            return;
          }

          // Fetch all recipes by ID in parallel
          const recipes: Recipe[] = await Promise.all(
            ids.map((id) =>
              fetch(`${API_BASE}/api/recipes/${id}`)
                .then((res) => res.json())
                .catch(() => null) // in case a recipe was deleted
            )
          ).then((list) => list.filter(Boolean)); // remove failed fetches

          setSavedRecipes(recipes);
          setSavedRecipeCount(recipes.length);
          setLoadingofSaved(false);
        })
        .catch((err) => {
          console.error("Failed to fetch saved recipe IDs", err);
          setSavedRecipes([]);
          setSavedRecipeCount(0);
          setLoadingofSaved(false);
        });
  }, [user]);

  if (!user) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-black"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProfileHeader userData={user} recipeCount={recipeCount} savedRecipeCount={savedRecipeCount}/>
        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="add-recipe">Add Recipe</TabsTrigger>
              <TabsTrigger value="saved-recipe">Saved Recipe</TabsTrigger>
            </TabsList>

            <TabsContent value="my-recipes">
              <RecipeList
                recipes={userRecipes}
                loading={loading}
                username={null}
              />
            </TabsContent>

            <TabsContent value="add-recipe">
              <RecipeForm
                userId={user.id}
                username={user.username || user.primaryEmailAddress?.emailAddress.split("@")[0] || "unknown"}
                onCreated={(recipe) => {
                  setUserRecipes((prev) => [...prev, recipe]);
                  setActiveTab("my-recipes");
                }}
              />
            </TabsContent>

            <TabsContent value="saved-recipe">
              <RecipeList
                recipes={savedRecipes}
                loading={loadingofSaved}
                username={null}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
