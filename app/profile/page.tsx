"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecipeCard } from "@/components/recipe-card";
import { PlusCircle, Settings, Upload } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser(); // Lấy thông tin user từ Clerk
  const [activeTab, setActiveTab] = useState("my-recipes");

  if (!user) return <div className="text-center py-10">Loading...</div>;

  const userData = {
    name: user.fullName || "Chưa có tên",
    username:
      user.username ||
      user.primaryEmailAddress?.emailAddress.split("@")[0] ||
      "unknown",
    avatar: user.imageUrl || "/placeholder.svg",
    bio: user.publicMetadata.bio || "Bạn chưa cập nhật tiểu sử.",
    recipeCount: 15,
    followers: 243,
    following: 112,
  };

  const userRecipes = [
    {
      id: "1",
      title: "Banh Mi Saigon",
      description:
        "A delicious Vietnamese sandwich with pickled vegetables and grilled pork.",
      rating: 4.8,
      author: userData.username,
      image: "/images/BanhMi.jpg",
    },
    {
      id: "2",
      title: "Bun Bo Hue",
      description: "Spicy beef noodle soup with lemongrass and chili oil.",
      rating: 4.6,
      author: userData.username,
      image: "/images/bunbohue.jpg",
    },
  ];

  const savedRecipes = [
    {
      id: "4",
      title: "Homemade Margherita Pizza",
      description: "Classic Italian pizza with mozzarella and basil.",
      rating: 4.9,
      author: "PizzaMaster",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
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

        <div className="w-full md:w-2/3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="add-recipe">Add Recipe</TabsTrigger>
            </TabsList>

            <TabsContent value="my-recipes" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Recipes</h2>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Recipe
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">Saved Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add-recipe" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Recipe</CardTitle>
                  <CardDescription>
                    Share your culinary creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Recipe Title</Label>
                      <Input id="title" placeholder="Enter recipe title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Briefly describe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recipe Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2 mx-auto" />
                        <p className="text-sm text-gray-500 mb-1">
                          Drag or click to upload
                        </p>
                        <Button variant="outline" size="sm">
                          Upload Image
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Publish Recipe
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
