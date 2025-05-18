import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Flag } from "lucide-react"

interface CommentSectionProps {
  recipeId: string
}

// Mock comments data
const comments = [
  {
    id: "1",
    user: {
      name: "Julia Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JC",
    },
    date: "2 days ago",
    content:
      "I made this last night and it was delicious! I added some red pepper flakes for a bit of heat and it worked really well with the creamy sauce.",
    likes: 12,
  },
  {
    id: "2",
    user: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
    },
    date: "1 week ago",
    content:
      "Great recipe! I substituted the heavy cream with half and half to make it a bit lighter and it still turned out creamy and delicious.",
    likes: 8,
  },
  {
    id: "3",
    user: {
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    date: "2 weeks ago",
    content: "My family loved this! Even my picky eaters cleaned their plates. Will definitely be making this again.",
    likes: 15,
  },
]

export function CommentSection({ recipeId }: CommentSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{comments.length} Comments</h3>

      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 pb-6 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
            <AvatarFallback>{comment.user.initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{comment.user.name}</h4>
                <p className="text-sm text-gray-500">{comment.date}</p>
              </div>
            </div>

            <p className="mt-2">{comment.content}</p>

            <div className="flex items-center gap-4 mt-3">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <ThumbsUp className="h-4 w-4" />
                <span>{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {comments.length > 3 && (
        <Button variant="outline" className="w-full">
          Load More Comments
        </Button>
      )}
    </div>
  )
}
