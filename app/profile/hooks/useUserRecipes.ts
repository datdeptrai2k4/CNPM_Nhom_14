import { useEffect, useState } from "react";
import { Recipe } from "@/lib/type";
import { API_BASE } from "@/lib/config";

export const useUserRecipes = (userId: string | undefined) => {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/recipes/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRecipes(data as Recipe[]);
        setLoading(false);
      });
  }, [userId]);

  return { userRecipes, setUserRecipes, loading };
};