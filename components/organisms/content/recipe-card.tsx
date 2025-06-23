import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/atoms/layout/card"
import { Button } from "@/components/atoms/visuals/button"

interface RecipeCardProps {
  id: string
  title: string
  description: string
  rating: number
  author: string
  image: string
}

export function RecipeCard({ id, title, description, rating, author, image }: RecipeCardProps) {
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
        <Button variant="outline" size="sm">
          Save
        </Button>
        <Link href={`/recipes/${id}`}>
          <Button size="sm">View Recipe</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
