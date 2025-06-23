// types.ts
export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  imageUrl?: string;
  videoUrl?: string;
  userId: string;
  categoryId: number;
  createdAt: string;
};
