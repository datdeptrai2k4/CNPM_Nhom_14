"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/atoms/visuals/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/molecules/navigation/tabs";
import { Recipe } from "@/lib/type";
import { ProfileHeader } from "./ProfileHeader";
import { RecipeForm } from "./RecipeForm";
import { RecipeList } from "./RecipeList";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-recipes");
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/recipes/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRecipes(data);
        setLoading(false);
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
        <ProfileHeader user={user} recipeCount={userRecipes.length} />
        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="add-recipe">Add Recipe</TabsTrigger>
            </TabsList>

            <TabsContent value="my-recipes">
              <RecipeList
                recipes={userRecipes}
                loading={loading}
                username={
                  user.username || user.primaryEmailAddress?.emailAddress.split("@")[0] || "unknown"
                }
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}
