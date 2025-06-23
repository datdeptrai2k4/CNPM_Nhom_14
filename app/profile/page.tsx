"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
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
import { Input } from "@/components/atoms/form/input";
import { Label } from "@/components/atoms/form/label";
import { Textarea } from "@/components/atoms/form/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/visuals/avatar";
import { RecipeCard } from "@/components/organisms/content/recipe-card";
import { PlusCircle, Settings, Upload } from "lucide-react";
import { API_BASE } from "@/lib/config";
import { getFullImageUrl } from "@/lib/utils";

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
  const api_based_url = API_BASE;
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-recipes");

  // State cho form thêm recipe
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1); // Giá trị mặc định, có thể fetch categories
  const [videoUrl, setVideoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");   // backend path

  // Danh sách recipe của user
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách recipe của user từ API
  useEffect(() => {
    if (!user) return;
    console.log(imagePath);
    fetch(`${api_based_url}/api/recipes/user/${user.id}`)
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
      imageUrl: imagePath,
      videoUrl,
      userId: user.id,
      categoryId: Number(categoryId),
    };

    const res = await fetch(`${api_based_url}/api/recipes/`, {
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
      setImagePath("");
      setImageUrl("");
      setImageFile(null);
      setVideoUrl("");
    } else {
      alert("Thêm recipe thất bại!");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set preview using URL.createObjectURL (for real file preview)
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${api_based_url}/api/recipes/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Image upload failed");
        return;
      }

      const { path } = await res.json();
      console.log(path);
      setImagePath(path); // <- this is the backend-hosted /uploads/xyz.jpg
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload error");
    }
  };


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
              ) : userRecipes.length === 0 ? (
                <div className="text-center text-muted-foreground mt-10 space-y-2">
                  <p className="text-xl font-semibold">No recipes yet...</p>
                  <p className="text-sm italic">
                    “The secret ingredient is always love.” 💛
                  </p>
                  <p className="text-sm italic">
                    Start by sharing your first dish with the world!
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
                        placeholder={"e.g. 2 eggs \n1 cup of sugar \n1/2 tsp salt"}
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter one ingredient per line for clarity.
                      </p>
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
                      <Label htmlFor="image">Upload Image</Label>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="image"
                          className="inline-flex cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
                        >
                          📁 Choose File
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {imageFile?.name || "No file chosen"}
                        </span>
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}

                        required
                      />
                      {imageFile && (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="mt-2 max-h-40 rounded border"
                        />
                      )}
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