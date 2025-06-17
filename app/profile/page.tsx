"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
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

type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  imageUrl?: string;
  videoUrl?: string;
  userId: string;
  categoryId: number;
  createdAt?: string;
  rating?: number; // <-- thêm dòng này
  author?: string; // nếu RecipeCard cần author
};

export default function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("my-recipes");

  // State cho form thêm recipe
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1); // Giá trị mặc định, có thể fetch categories
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Danh sách recipe của user
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách recipe của user từ API
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/recipes/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setUserRecipes(data as Recipe[]);
        setLoading(false);
      });
  }, [user]);

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
    userId: user.id,
  };

  // Hàm xử lý submit form
  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !ingredients || !categoryId) return;

    const newRecipe = {
      title,
      description,
      ingredients,
      imageUrl,
      videoUrl,
      userId: user.id,
      categoryId: Number(categoryId),
    };

    const res = await fetch("http://localhost:3000/api/recipes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    });

    if (res.ok) {
      const created = await res.json();
      setUserRecipes((old) => [
        ...old,
        { ...created, description: created.description ?? "", ingredients: created.ingredients ?? "" },
      ]);
      setActiveTab("my-recipes");
      setTitle("");
      setDescription("");
      setIngredients("");
      setCategoryId(1);
      setImageUrl("");
      setVideoUrl("");
    } else {
      alert("Thêm recipe thất bại!");
    }
  };

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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    description={recipe.description ?? ""}
                    title={recipe.title ?? ""}
                    image={recipe.imageUrl ?? "/placeholder.svg"}
                    rating={typeof recipe.rating === "number" ? recipe.rating : 0}
                    author={recipe.author ?? userData.username}
                  />
                  ))}
                </div>
              )}
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
                  <form className="space-y-4" onSubmit={handleAddRecipe}>
                    <div className="space-y-2">
                      <Label htmlFor="title">Recipe Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter recipe title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Briefly describe"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingredients</Label>
                      <Textarea
                        id="ingredients"
                        placeholder="List ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Category ID</Label>
                      <Input
                        id="categoryId"
                        type="number"
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        required
                      />
                      {/* Bạn có thể fetch category list về để dropdown, ở đây nhập id trực tiếp */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">Video URL</Label>
                      <Input
                        id="videoUrl"
                        placeholder="Video URL"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
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