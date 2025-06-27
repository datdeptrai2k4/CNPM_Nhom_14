import { API_BASE } from "@/lib/config";

// Lấy comment theo recipeId
export async function fetchCommentsByRecipe(recipeId: string) {
  const res = await fetch(`${API_BASE}/api/comments/recipe/${recipeId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

// Thêm comment mới
export async function addComment(data: { userId: string; recipeId: string; content: string }) {
  const res = await fetch(`${API_BASE}/api/comments`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    let msg = "Failed to add comment";
    try { 
      const err = await res.json();
      msg = err.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// Xóa comment
// /lib/api/comment.ts
export async function deleteComment(commentId: number | string) {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, { method: "DELETE" });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete comment");
    }
    return await res.json();
  }

