"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Check, Eye, Flag, MoreHorizontal, Search, Users, Utensils, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data for reported content
  const reportedContent = [
    {
      id: "1",
      type: "recipe",
      title: "Spicy Garlic Noodles",
      author: "user123",
      reportCount: 3,
      reason: "Inappropriate content",
      date: "2023-05-15",
    },
    {
      id: "2",
      type: "comment",
      title: "This recipe is terrible...",
      author: "angryuser",
      reportCount: 5,
      reason: "Harassment",
      date: "2023-05-18",
    },
    {
      id: "3",
      type: "recipe",
      title: "Alcoholic Fruit Punch",
      author: "partychef",
      reportCount: 2,
      reason: "Inappropriate for minors",
      date: "2023-05-20",
    },
  ]

  // Mock data for users
  const users = [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarahjohnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      recipeCount: 15,
      status: "active",
      joined: "2023-01-15",
    },
    {
      id: "2",
      name: "Michael Chen",
      username: "mikechen",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      recipeCount: 8,
      status: "active",
      joined: "2023-02-22",
    },
    {
      id: "3",
      name: "Jessica Williams",
      username: "jesswill",
      email: "jess@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      recipeCount: 3,
      status: "suspended",
      joined: "2023-03-10",
    },
  ]

  // Mock data for recipes
  const recipes = [
    {
      id: "1",
      title: "Creamy Garlic Parmesan Pasta",
      author: "sarahjohnson",
      category: "Italian",
      status: "published",
      views: 1245,
      likes: 87,
      date: "2023-04-15",
    },
    {
      id: "2",
      title: "Spicy Thai Basil Chicken",
      author: "mikechen",
      category: "Asian",
      status: "published",
      views: 892,
      likes: 63,
      date: "2023-04-22",
    },
    {
      id: "3",
      title: "Classic Chocolate Chip Cookies",
      author: "jesswill",
      category: "Desserts",
      status: "under review",
      views: 0,
      likes: 0,
      date: "2023-05-10",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage recipes, users, and site content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                  <Utensils className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-gray-500">+24 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,672</div>
                  <p className="text-xs text-gray-500">+128 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <Eye className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245,689</div>
                  <p className="text-xs text-gray-500">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
                  <Flag className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">5 need review</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user and content activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">sarahjohnson</span> added a new recipe
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">mikechen</span> commented on a recipe
                        </p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">jesswill</span> registered a new account
                        </p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Popular Categories</CardTitle>
                    <CardDescription>Most viewed recipe categories</CardDescription>
                  </div>
                  <BarChart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Italian</p>
                        <p className="text-sm text-gray-500">32%</p>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "32%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Asian</p>
                        <p className="text-sm text-gray-500">28%</p>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Desserts</p>
                        <p className="text-sm text-gray-500">18%</p>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">American</p>
                        <p className="text-sm text-gray-500">12%</p>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recipes</CardTitle>
                    <CardDescription>Manage all recipes on the platform</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search recipes..." />
                    </div>
                    <Button>Add Recipe</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">{recipe.title}</TableCell>
                        <TableCell>{recipe.author}</TableCell>
                        <TableCell>{recipe.category}</TableCell>
                        <TableCell>
                          <Badge variant={recipe.status === "published" ? "default" : "outline"}>{recipe.status}</Badge>
                        </TableCell>
                        <TableCell>{recipe.views}</TableCell>
                        <TableCell>{recipe.likes}</TableCell>
                        <TableCell>{recipe.date}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Recipe</DropdownMenuItem>
                              <DropdownMenuItem>Edit Recipe</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete Recipe</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage user accounts</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search users..." />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Recipes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.recipeCount}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {user.status === "active" ? "Suspend User" : "Activate User"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete Account</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reported Content</CardTitle>
                    <CardDescription>Review and moderate reported content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedContent.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell>{report.reportCount}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="outline" size="icon" className="text-green-600">
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-600">
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
