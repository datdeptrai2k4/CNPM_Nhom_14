// types.ts
export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string; // JSON string or parsed array
  imageUrl?: string;
  videoUrl?: string;
  rating?: number;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  userId: string;
  author: string;
  categoryId: number;
  createdAt?: string;
};