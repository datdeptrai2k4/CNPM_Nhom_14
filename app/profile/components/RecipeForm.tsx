"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/layout/card";
import { Label } from "@/components/atoms/form/label";
import { Input } from "@/components/atoms/form/input";
import { Textarea } from "@/components/atoms/form/textarea";
import { Button } from "@/components/atoms/visuals/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/input-group/select";
import { API_BASE } from "@/lib/config";
import { Recipe } from "@/lib/type";
import { updateRecipe } from "@/lib/api/recipe";
import { categoryApi, Category } from "@/lib/api/category";

export const RecipeForm = ({
  username,
  userId,
  onCreated,
  editingRecipe,
  onCancel,
}: {
  username: string,
  userId: string;
  onCreated: (newRecipe: Recipe) => void;
  editingRecipe?: Recipe | null;
  onCancel?: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState<number>(10);
  const [cookTime, setCookTime] = useState<number>(10);
  const [servings, setServings] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  
  // Category state management
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await categoryApi.getAll();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Keep loading state as true to show fallback
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || "");
      setDescription(editingRecipe.description || "");
      setIngredients(editingRecipe.ingredients || "");
      setInstructions(editingRecipe.instructions || "");
      setPrepTime(editingRecipe.prepTime || 10);
      setCookTime(editingRecipe.cookTime || 10);
      setServings(editingRecipe.servings || 1);
      setCategoryId(editingRecipe.categoryId || 1);
      setVideoUrl(editingRecipe.videoUrl || "");
      setImagePath(editingRecipe.imageUrl || "");
      // For editing, we don't set imageFile or imageUrl since the image is already uploaded
    } else {
      // Reset form for new recipe
      setTitle("");
      setDescription("");
      setIngredients("");
      setInstructions("");
      setPrepTime(10);
      setCookTime(10);
      setServings(1);
      setCategoryId(1);
      setVideoUrl("");
      setImageFile(null);
      setImageUrl("");
      setImagePath("");
    }
  }, [editingRecipe]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/recipes/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Image upload failed");
        return;
      }

      const { path } = await res.json();
      setImagePath(path);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload error");
    }
  };

  const handleSubmitRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !ingredients || !categoryId) return;

    const recipeData = {
      title,
      description,
      ingredients,
      imageUrl: imagePath,
      prepTime,
      cookTime,
      servings,
      instructions,
      videoUrl,
      author: username,
      userId,
      categoryId,
    };

    try {
      let result;
      if (editingRecipe) {
        // Update existing recipe
        result = await updateRecipe(editingRecipe.id, recipeData);
        result = result.recipe; // Extract recipe from response
      } else {
        // Create new recipe
        const res = await fetch(`${API_BASE}/api/recipes/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipeData),
        });
        if (!res.ok) throw new Error("Failed to create recipe");
        result = await res.json();
      }

      onCreated(result);
      
      if (!editingRecipe) {
        // Only reset form for new recipes, not edits
        setTitle("");
        setDescription("");
        setIngredients("");
        setInstructions("");
        setImageFile(null);
        setImageUrl("");
        setImagePath("");
        setPrepTime(10);
        setCookTime(10);
        setServings(1);
        setVideoUrl("");
        setCategoryId(1);
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
      alert(editingRecipe ? "Failed to update recipe!" : "Failed to add recipe!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingRecipe ? "Edit Recipe" : "Add New Recipe"}</CardTitle>
        <CardDescription>
          {editingRecipe ? "Update your recipe details" : "Share your culinary creation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmitRecipe}>
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
              placeholder={"e.g. 2 eggs\n1 cup sugar\n1/2 tsp salt"}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Step-by-step..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="prepTime">Prep Time</Label>
              <Input
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                placeholder="e.g. 15"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="cookTime">Cook Time</Label>
              <Input
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                placeholder="e.g. 30"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                placeholder="e.g. 4"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            {loadingCategories ? (
              <Input
                id="categoryId"
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                placeholder="Loading categories..."
                required
                disabled
              />
            ) : categories.length > 0 ? (
              <Select
                value={categoryId.toString()}
                onValueChange={(value) => setCategoryId(Number(value))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="categoryId"
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                placeholder="Enter category ID (categories failed to load)"
                required
              />
            )}
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
              required={!editingRecipe}
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
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {editingRecipe ? "Update Recipe" : "Publish Recipe"}
            </Button>
            {editingRecipe && onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
