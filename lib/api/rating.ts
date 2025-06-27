import { API_BASE } from "@/lib/config";

/**
 * Lấy rating của user cho 1 recipe (nếu có)
 */
export async function fetchUserRating(userId: string, recipeId: string) {
  const res = await fetch(
    `${API_BASE}/api/ratings/user/${userId}?recipeId=${recipeId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const ratings = await res.json();
  // Nếu backend trả về mảng, lấy rating của recipe đang cần
  if (Array.isArray(ratings)) {
    return ratings.find((r) => r.recipeId === recipeId) || null;
  }
  return ratings;
}

/**
 * Thêm mới hoặc cập nhật rating của user cho 1 recipe
 */
export async function addOrUpdateRating({
  userId,
  recipeId,
  score,
}: {
  userId: string;
  recipeId: string;
  score: number;
}) {
  // Thử lấy rating cũ
  const existing = await fetchUserRating(userId, recipeId);

  if (existing && existing.id) {
    // Đã có -> update
    const res = await fetch(`${API_BASE}/api/ratings/${existing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
    if (!res.ok) throw new Error("Failed to update rating");
    return await res.json();
  } else {
    // Chưa có -> tạo mới
    const res = await fetch(`${API_BASE}/api/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId, score }),
    });
    if (!res.ok) throw new Error("Failed to add rating");
    return await res.json();
  }
}

export async function fetchRatingsByRecipe(recipeId: string) {
    const res = await fetch(`${API_BASE}/api/ratings/recipe/${recipeId}`);
    if (!res.ok) return [];
    return await res.json(); // [{ userId, score, ... }, ...]
  }

