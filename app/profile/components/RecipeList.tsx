import { Recipe } from "@/lib/type";
import { RecipeCard } from "@/components/organisms/content/recipe-card";
import { getFullImageUrl } from "@/lib/utils";
import { useEffect } from "react";

export const RecipeList = ({
  recipes,
  loading,
  username,
  isOwner = false,
  onEdit,
  onDelete,
}: {
  recipes: Recipe[];
  loading: boolean;
  username: string | null;
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  useEffect(() => {
    console.log(username);
  })
  
  if (loading) return <div>Loading recipes...</div>;

  if (recipes.length === 0)
    return (
      <div className="text-center text-muted-foreground mt-10 space-y-2">
        <p className="text-xl font-semibold">No recipes yet...</p>
        <p className="text-sm italic">“The secret ingredient is always love.” 💛</p>
        <p className="text-sm italic">Start by sharing your first dish with the world!</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          {...recipe}
          image={getFullImageUrl(recipe.imageUrl)}
          rating={typeof recipe.rating === "number" ? recipe.rating : 0}
          author={username || recipe.author}
          showOwnerActions={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
