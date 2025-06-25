"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, Flag, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/visuals/avatar";
import { Button } from "@/components/atoms/visuals/button";
import { Textarea } from "@/components/atoms/form/textarea";
import { fetchCommentsByRecipe, addComment, deleteComment } from "@/lib/api/comment";
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

  useEffect(() => {
    setLoading(true);
    fetchCommentsByRecipe(recipeId)
      .then((data) => {
        console.log("Fetched comments:", data);
        setComments(data);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      })
      .finally(() => setLoading(false));
  }, [recipeId]);

  const handleAdd = async () => {
    if (!content.trim() || !user?.id) return;
    setSubmitting(true);
    try {
      await addComment({
        userId: user.id,
        recipeId,
        content,
      });
      setContent("");
      // Sau khi thêm, fetch lại toàn bộ comment từ server để đảm bảo dữ liệu mới nhất
      setLoading(true);
      const updatedComments = await fetchCommentsByRecipe(recipeId);
      setComments(updatedComments);
      setLoading(false);
    } catch {
      alert("Failed to add comment!");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number | string) => {
    console.log("Request delete with id:", id);
    if (!id) {
      alert("Comment ID bị thiếu!");
      return;
    }
    if (!user?.id) {
      console.warn("User chưa đăng nhập!");
      return;
    }
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      console.log("Deleted comment with id:", id);
    } catch (e) {
      alert("Failed to delete comment!");
      console.error("Delete comment error:", e);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{comments.length} Comments</h3>
      <div className="mb-6 flex flex-col gap-2">
        <Textarea
          placeholder="Share your thoughts or tips about this recipe..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="mb-2"
        />
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
          {comments.map((comment, idx) => {
            console.log("Render comment:", comment);
            return (
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
            );
          })}
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