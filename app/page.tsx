"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { API_BASE } from "@/lib/config";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/atoms/visuals/button";
import { Input } from "@/components/atoms/form/input";
import { RecipeCard } from "@/components/organisms/content/recipe-card";
import { FeaturedRecipes } from "@/components/organisms/content/featured-recipes";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

interface Recipe {
  id: string;
  title: string;
  description: string;
  rating?: number;
  author: string;
  imageUrl?: string;
  // add more fields if needed
}

export default function Home() {
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/recipes`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by createdAt descending if available, else fallback to id (if using UUID v1)
        const sorted = data.sort((a: any, b: any) =>
          b.createdAt && a.createdAt
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : 0
        );
        setLatestRecipes(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  // Only show 3 newest recipes unless showAll is true
  const recipesToShow = showAll ? latestRecipes : latestRecipes.slice(0, 3);

  const { user } = useUser()
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">RecipeShare</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/recipes"
          >
            Recipes
          </Link>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/profile"
          >
            My Recipes
          </Link>
          {user?.publicMetadata.role === "admin" && <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/admin"
          >
            Admin
          </Link>}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-amber-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Share Your Culinary Creations
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Discover, share, and rate delicious recipes from around the
                  world.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="w-full bg-white pl-8 rounded-full"
                    placeholder="Search recipes or ingredients..."
                    type="search"
                  />
                </div>
                <Button className="w-full rounded-full" type="submit">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Featured Recipes
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Explore our most popular and highly-rated recipes.
                </p>
              </div>
            </div>
            <FeaturedRecipes />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Latest Recipes
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Check out the newest additions to our recipe collection.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {loading ? (
                <div className="col-span-3 text-center text-gray-500">Loading...</div>
              ) : recipesToShow.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No recipes found.</div>
              ) : (
                recipesToShow.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    rating={recipe.rating ?? 0}
                    author={recipe.author}
                    image={recipe.imageUrl ?? "/placeholder.jpg"}
                  />
                ))
              )}
            </div>
            <div className="flex justify-center mt-8">
              {!showAll && latestRecipes.length > 3 ? (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowAll(true)}
                >
                  View All Recipes
                </Button>
              ) : (
                showAll && latestRecipes.length > 3 && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setShowAll(false)}
                  >
                    Show Less
                  </Button>
                )
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 RecipeShare. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}