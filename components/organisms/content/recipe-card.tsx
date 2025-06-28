import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Star, Check, Edit, Trash2 } from "lucide-react"
import { API_BASE } from "@/lib/config"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/atoms/layout/card"
import { Button } from "@/components/atoms/visuals/button"
import { useState } from "react"

interface RecipeCardProps {
  id: string
  title: string
  description: string
  rating: number
  author: string
  image: string
  showOwnerActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function RecipeCard({ id, title, description, rating, author, image, showOwnerActions, onEdit, onDelete }: RecipeCardProps) {
  const { user } = useUser();
  const [successSave, setSuccessSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveRecipe = async (userId: string, recipeId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/saved-recipes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, recipeId })
      });
      return res.ok;
    } catch (error) {
      console.error("Error saving recipe:", error);
      return false;
    }
  }

  const handleSave = async () => {
    setIsLoading(true);
    const result = await saveRecipe(user?.id || "unknown user id", id);
    setSuccessSave(result);
    setIsLoading(false);
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Link href={`/recipes/${id}`} className="hover:underline">
            <h3 className="font-semibold text-lg">{title}</h3>
          </Link>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">By {author}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {!showOwnerActions && (
            successSave ? (
              <Button variant="outline" size="sm" disabled>
                <Check className="w-4 h-4 mr-1" />
                Saved
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            )
          )}
          {showOwnerActions && (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit?.(id)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete?.(id)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
        <Link href={`/recipes/${id}`}>
          <Button size="sm">View Recipe</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
