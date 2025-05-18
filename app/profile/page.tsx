"use client";

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
  const [activeTab, setActiveTab] = useState("my-recipes");

  // Mock user data
  const user = {
    name: "Cường Kiute",
    username: "cuongkiute",
    avatar: "/images/avatar01.jpg?height=100&width=100",
    bio: "Thức ăn là một phần không thể thiếu trong cuộc sống của tôi.",
    recipeCount: 15,
    followers: 243,
    following: 112,
  };

  // Mock recipes data
  const userRecipes = [
    {
      id: "1",
      title: "Banh Mi Saigon",
      description:
        "A delicious Vietnamese sandwich with pickled vegetables and grilled pork.",
      rating: 4.8,
      author: user.username,
      image: "/images/BanhMi.jpg?height=300&width=400",
    },
    {
      id: "2",
      title: "Bun Bo Hue",
      description: "Spicy beef noodle soup with lemongrass and chili oil.",
      rating: 4.6,
      author: user.username,
      image: "/images/bunbohue.jpg?height=300&width=400",
    },
    {
      id: "3",
      title: "Com Tam",
      description:
        "Broken rice with grilled pork, pickled vegetables, and fried egg.",
      rating: 4.9,
      author: user.username,
      image: "/images/ComTam.jpg?height=300&width=400",
    },
  ];

  // Mock saved recipes data
  const savedRecipes = [
    {
      id: "4",
      title: "Homemade Margherita Pizza",
      description:
        "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
      rating: 4.9,
      author: "PizzaMaster",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "5",
      title: "Beef Wellington",
      description:
        "Tender beef fillet wrapped in puff pastry with mushroom duxelles.",
      rating: 4.8,
      author: "GourmetChef",
      image: "/placeholder.svg?height=300&width=400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">{user.bio}</p>
              <div className="flex justify-center gap-6 text-center">
                <div>
                  <p className="font-bold">{user.recipeCount}</p>
                  <p className="text-sm text-gray-500">Recipes</p>
                </div>
                <div>
                  <p className="font-bold">{user.followers}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="font-bold">{user.following}</p>
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
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    rating={recipe.rating}
                    author={recipe.author}
                    image={recipe.image}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">Saved Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    rating={recipe.rating}
                    author={recipe.author}
                    image={recipe.image}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add-recipe" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Recipe</CardTitle>
                  <CardDescription>
                    Share your culinary creation with the community
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
                        placeholder="Briefly describe your recipe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Recipe Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                          Drag and drop an image here, or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG or WEBP (max. 5MB)
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Upload Image
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prep-time">Prep Time</Label>
                        <Input id="prep-time" placeholder="e.g. 15 mins" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cook-time">Cook Time</Label>
                        <Input id="cook-time" placeholder="e.g. 30 mins" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="servings">Servings</Label>
                        <Input
                          id="servings"
                          placeholder="e.g. 4"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingredients</Label>
                      <Textarea
                        id="ingredients"
                        placeholder="Enter ingredients, one per line"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Enter step-by-step instructions"
                        rows={8}
                      />
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
