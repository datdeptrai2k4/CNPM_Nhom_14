"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Home, PlusCircle, Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/navigation/tabs";
import { Button } from "@/components/atoms/visuals/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/layout/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/visuals/avatar";
import { RecipeCard } from "@/components/organisms/content/recipe-card";
import { API_BASE } from "@/lib/config";
import { getFullImageUrl } from "@/lib/utils";
import { RecipeForm } from "./components/RecipeForm";
import { Recipe } from "@/lib/type";

export default function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("my-recipes");
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/api/recipes/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRecipes(data);
        setLoading(false);
      });
  }, [user]);

  const handleNewRecipe = (newRecipe: Recipe) => {
    setUserRecipes((prev) => [...prev, newRecipe]);
    setActiveTab("my-recipes");
  };

  if (!user) return <div className="text-center py-10">Loading...</div>;

  const userData = {
    name: user.fullName || "Chưa có tên",
    username:
      user.username ||
      user.primaryEmailAddress?.emailAddress.split("@")[0] ||
      "unknown",
    avatar: user.imageUrl || "/placeholder.svg",
    bio: user.publicMetadata.bio || "Bạn chưa cập nhật tiểu sử.",
    recipeCount: userRecipes.length,
    followers: 243,
    following: 112,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => location.href = "/"}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-black"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{userData.name}</CardTitle>
              <CardDescription>@{userData.username}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center gap-6 text-center">
                <div>
                  <p className="font-bold">{userData.recipeCount}</p>
                  <p className="text-sm text-gray-500">Recipes</p>
                </div>
                <div>
                  <p className="font-bold">{userData.followers}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="font-bold">{userData.following}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="add-recipe">Add Recipe</TabsTrigger>
            </TabsList>

            <TabsContent value="my-recipes" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Recipes</h2>
                <Button onClick={() => setActiveTab("add-recipe")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Recipe
                </Button>
              </div>
              {loading ? (
                <div>Loading recipes...</div>
              ) : userRecipes.length === 0 ? (
                <div className="text-center text-muted-foreground mt-10 space-y-2">
                  <p className="text-xl font-semibold">No recipes yet...</p>
                  <p className="text-sm italic">
                    “The secret ingredient is always love.” 💛
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      {...recipe}
                      description={recipe.description ?? ""}
                      title={recipe.title ?? ""}
                      image={getFullImageUrl(recipe.imageUrl)}
                      rating={typeof recipe.rating === "number" ? recipe.rating : 0}
                      author={recipe.author ?? userData.username}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-recipe" className="mt-6">
              <RecipeForm 
                username={user.username || user.primaryEmailAddress?.emailAddress.split("@")[0] || "unknown"} 
                userId={user.id} 
                onCreated={handleNewRecipe} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
