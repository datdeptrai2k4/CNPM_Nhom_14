"use client";

import { useState } from "react";
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
import { API_BASE } from "@/lib/config";
import { Recipe } from "@/lib/type";

export const RecipeForm = ({
  username,
  userId,
  onCreated,
}: {
  username: string,
  userId: string;
  onCreated: (newRecipe: Recipe) => void;
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

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !ingredients || !categoryId) return;

    const newRecipe = {
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

    const res = await fetch(`${API_BASE}/api/recipes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    });

    if (res.ok) {
      const created = await res.json();
      onCreated(created);
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
    } else {
      alert("Failed to add recipe!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Recipe</CardTitle>
        <CardDescription>Share your culinary creation</CardDescription>
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
            <Label htmlFor="categoryId">Category ID</Label>
            <Input
              id="categoryId"
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            />
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
  );
};
