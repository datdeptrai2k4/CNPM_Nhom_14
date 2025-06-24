import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/visuals/avatar";
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from "@/components/atoms/layout/card";
import { Button } from "@/components/atoms/visuals/button";
import { Settings } from "lucide-react";

export function ProfileHeader({ userData }: { userData: any }) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userData.avatar} />
          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">{userData.name}</CardTitle>
        <CardDescription>@{userData.username}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex justify-center gap-6">
          {["recipeCount", "followers", "following"].map((key) => (
            <div key={key}>
              <p className="font-bold">{userData[key]}</p>
              <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, " $1")}</p>
            </div>
          ))}
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
