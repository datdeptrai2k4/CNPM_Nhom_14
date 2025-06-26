"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, Flag, Trash2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/visuals/avatar";
import { Button } from "@/components/atoms/visuals/button";
import { Textarea } from "@/components/atoms/form/textarea";
import { fetchCommentsByRecipe, addComment, deleteComment } from "@/lib/api/comment";
import { fetchRatingsByRecipe, fetchUserRating, addOrUpdateRating } from "@/lib/api/rating";
import { useUser } from "@clerk/nextjs";

interface Comment {
  id: number | string;
  content: string;
  userId: string;
  createdAt: string;
  user?: {
    name?: string;
    avatar?: string;
    initials?: string;
  };
  score?: number;
}

interface CommentSectionProps {
  recipeId: string;
}

export function CommentSection({ recipeId }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratings, setRatings] = useState<{ userId: string; score: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load comments
  useEffect(() => {
    setLoading(true);
    fetchCommentsByRecipe(recipeId)
      .then((data) => setComments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [recipeId]);

  // Load ratings cho recipe này
  useEffect(() => {
    fetchRatingsByRecipe(recipeId)
      .then((data) => setRatings(data))
      .catch(() => {});
  }, [recipeId]);

  // Load user's rating (nếu đã từng rating)
  useEffect(() => {
    if (!user?.id) return;
    setRatingLoading(true);
    fetchUserRating(user.id, recipeId)
      .then((data) => {
        if (data && typeof data.score === "number") setUserRating(data.score);
      })
      .catch(() => {})
      .finally(() => setRatingLoading(false));
  }, [user?.id, recipeId]);

  // Khi render, gắn score cho từng comment theo userId
  const commentsWithScore = comments.map((c) => ({
    ...c,
    score: ratings.find((r) => r.userId === c.userId)?.score,
  }));

  const handleAdd = async () => {
    if (!content.trim() || !user?.id) return;
    setSubmitting(true);
    setError(null);
    try {
      // Gửi comment
      await addComment({
        userId: user.id,
        recipeId,
        content,
      });
      // Gửi rating nếu có chọn
      if (userRating) {
        await addOrUpdateRating({
          userId: user.id,
          recipeId,
          score: userRating,
        });
      }
      setContent("");
      // reload comments & ratings để UI luôn cập nhật số sao mới
      setLoading(true);
      const [updatedComments, updatedRatings] = await Promise.all([
        fetchCommentsByRecipe(recipeId),
        fetchRatingsByRecipe(recipeId)
      ]);
      setComments(updatedComments);
      setRatings(updatedRatings);
      setLoading(false);
    } catch (err: any) {
      // Hiển thị lỗi cụ thể từ backend nếu có
      let message = "Failed to add comment!";
      if (err && (err.error || err.message)) {
        // Nếu dùng fetch, có thể là err.error, nếu throw Error thì err.message
        message = err.error || err.message;
      }
      // Nếu là lỗi đã comment rồi
      if (
        message.toLowerCase().includes("bạn đã bình luận") ||
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("đã comment") ||
        message.toLowerCase().includes("duplicate")
      ) {
        setError("Bạn đã bình luận công thức này rồi!");
      } else {
        setError(message);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number | string) => {
    if (!id) {
      alert("Comment ID bị thiếu!");
      return;
    }
    if (!user?.id) return;
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete comment!");
    }
  };

  // Xử lý chọn rating
  const handleRating = (score: number) => {
    setUserRating(score);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{comments.length} Comments</h3>
      <div className="mb-6 flex flex-col gap-2">
        {/* UI chọn số sao */}
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRating(star)}
              className="focus:outline-none"
              aria-label={`Rate ${star} stars`}
              disabled={ratingLoading || !user?.id}
            >
              <Star
                className={`h-6 w-6 ${
                  userRating && star <= userRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {userRating
              ? `Bạn đã chọn ${userRating} sao`
              : "Chọn số sao (không bắt buộc)"}
          </span>
        </div>
        <Textarea
          placeholder="Share your thoughts or tips about this recipe..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="mb-2"
        />
        {error && (
          <div className="text-red-500 mb-2">{error}</div>
        )}
        <div className="flex justify-end">
          <Button
            onClick={handleAdd}
            disabled={submitting || !content.trim() || !user?.id}
            className="w-fit px-6"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <>
         {commentsWithScore.map((comment, idx) => (
            <div key={comment.id ?? idx} className="flex gap-4 pb-6 border-b">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} alt={comment.user?.name || "User"} />
                <AvatarFallback>
                  {comment.user?.initials ||
                    comment.user?.name?.[0]?.toUpperCase() ||
                    comment.userId?.[0]?.toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {comment.user?.name ||
                        (comment.userId === user?.id ? "You" : comment.userId)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    {/* HIỆN SỐ SAO Ở ĐÂY */}
                    {typeof comment.score === "number" && (
                      <div className="flex items-center gap-[2px] mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              (comment.score ?? 0) >= star ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">({comment.score}/5)</span>
                      </div>
                    )}
                  </div>
                  {comment.userId === user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(comment.id)}
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-2">{comment.content}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500 hover:text-gray-700" disabled>
                    <ThumbsUp className="h-4 w-4" />
                    <span>Like</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500 hover:text-gray-700" disabled>
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {comments.length > 10 && (
            <Button variant="outline" className="w-full" disabled>
              Load More Comments
            </Button>
          )}
        </>
      )}
    </div>
  );
}