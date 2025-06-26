import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/visuals/avatar";
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from "@/components/atoms/layout/card";
import { Button } from "@/components/atoms/visuals/button";
import { Settings } from "lucide-react";

export function ProfileHeader({ userData, recipeCount, savedRecipeCount }: { userData: any, recipeCount: number, savedRecipeCount: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userData.imageUrl} />
          <AvatarFallback>{userData.fullName}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">{userData.fullName}</CardTitle>
        <CardDescription>@{userData.username || userData?.emailAddresses[0].emailAddress}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex justify-center gap-6">
            <div>
              <p className="font-bold">{recipeCount}</p>
              <p className="text-sm text-gray-500">Recipe Count</p>
            </div>
            <div>
              <p className="font-bold">{savedRecipeCount}</p>
              <p className="text-sm text-gray-500">Saved Recipe Count</p>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Settings className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
