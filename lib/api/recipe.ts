import { API_BASE } from "@/lib/config";

// Update a recipe
export async function updateRecipe(recipeId: string, data: any, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/recipes/${recipeId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    let msg = "Failed to update recipe";
    try {
      const err = await res.json();
      msg = err.error || msg;
    } catch {}
    throw new Error(msg);
  }
  
  return res.json();
}

// Delete a recipe
export async function deleteRecipe(recipeId: string, token?: string) {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/recipes/${recipeId}`, {
    method: "DELETE",
    headers,
  });
  
  if (!res.ok) {
    let msg = "Failed to delete recipe";
    try {
      const err = await res.json();
      msg = err.error || msg;
    } catch {}
    throw new Error(msg);
  }
  
  return res.json();
}

// Get a single recipe by ID
export async function getRecipeById(recipeId: string) {
  const res = await fetch(`${API_BASE}/api/recipes/${recipeId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch recipe");
  }
  return res.json();
} 