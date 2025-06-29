"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/navigation/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/layout/card"
import { Button } from "@/components/atoms/visuals/button"
import { Input } from "@/components/atoms/form/input"
import { Label } from "@/components/atoms/form/label"
import { Textarea } from "@/components/atoms/form/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/organisms/data/table"
import { Badge } from "@/components/atoms/visuals/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/visuals/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/molecules/overlays/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/feedback/alert-dialog"
import { BarChart, Check, Eye, Flag, MoreHorizontal, Plus, Search, Users, Utensils, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/overlays/dropdown-menu"
import { API_BASE } from "@/lib/config"
import { categoryApi, Category, CategoryApiError } from "@/lib/api/category"
import { useToast } from "@/components/utils/use-toast"
import { Toaster } from "@/components/feedback/toaster"

// Mock data for recipes (keeping this as categories is the focus)
const MOCK_RECIPES = [
  {
    id: "1",
    title: "Spicy Garlic Noodles",
    author: "user123",
    categoryId: "1",
    status: "published",
    views: 120,
    rating: 4.5,
    createdAt: "2023-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Classic Beef Stew",
    author: "chefMike",
    categoryId: "2",
    status: "under_review",
    views: 85,
    rating: 4.0,
    createdAt: "2023-06-09T10:00:00Z",
  },
]

const MOCK_REPORTED = [
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
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  
  // Category state management
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  // Load users on component mount
  useEffect(() => {
    fetch(`${API_BASE}/api/users/`)
      .then((res) => res.json())
      .then((clerkUsers) => {
        const parsedUsers = clerkUsers.map((user) => ({
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
          username: user.username,
          email: user.email || "—",
          avatar: user.imageUrl,
          status: user.banned ? "banned" : "active",
          role: user.publicMetadata?.role || "user",
          createdAt: new Date(user.createdAt),
          banned: user.banned,
          public_metadata: user.publicMetadata,
        }));

        setUsers(parsedUsers);
        setLoadingUsers(false);
      })
      .catch((error) => {
        console.error('Error loading users:', error);
        setLoadingUsers(false);
      });
  }, []);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Category API functions
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load categories",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCreateCategory = async (formData: FormData) => {
    try {
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      
      const newCategory = await categoryApi.create({
        name,
        description: description || undefined,
      });
      
      setCategories(prev => [...prev, newCategory]);
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof CategoryApiError ? error.message : "Failed to create category",
      });
    }
  };

  const handleUpdateCategory = async (id: number, formData: FormData) => {
    try {
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      
      const updatedCategory = await categoryApi.update(id, {
        name,
        description: description || undefined,
      });
      
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updatedCategory : cat
      ));
      setEditingCategory(null);
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof CategoryApiError ? error.message : "Failed to update category",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryApi.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof CategoryApiError ? error.message : "Failed to delete category",
      });
    }
  };

  
  const handleToggleStatus = async (userId) => {
    await fetch(`${API_BASE}/api/users/toggle-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    //@ts-ignore
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              banned: !user.banned,
              status: user.banned ? "active" : "banned",
            }
          : user
      )
    );
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch(`${API_BASE}/api/users/set-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole }),
    });
    //@ts-ignore
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage recipes, users, and site content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
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
                  <div className="text-2xl font-bold">{MOCK_RECIPES.length}</div>
                  <p className="text-xs text-gray-500">
                    +{MOCK_RECIPES.filter((r) => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <BarChart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-gray-500">
                    {loadingCategories ? 'Loading...' : 'Total categories'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-gray-500">
                    +{users.filter((u) => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <BarChart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-gray-500">Active categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
                  <Flag className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{MOCK_REPORTED.length}</div>
                  <p className="text-xs text-gray-500">{MOCK_REPORTED.length} need review</p>
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
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_RECIPES.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">{recipe.title}</TableCell>
                        <TableCell>{recipe.author}</TableCell>
                        <TableCell>{categories.find((c) => c.id.toString() === recipe.categoryId)?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge variant={recipe.status === "published" ? "default" : "outline"}>{recipe.status}</Badge>
                        </TableCell>
                        <TableCell>{recipe.views}</TableCell>
                        <TableCell>{recipe.rating.toFixed(1)}</TableCell>
                        <TableCell>{new Date(recipe.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Recipe</DropdownMenuItem>
                              <DropdownMenuItem>Edit Recipe</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Unpublish</DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                    Delete Recipe
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the recipe.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New User</DialogTitle>
                          <DialogDescription>Add a new user to the platform</DialogDescription>
                        </DialogHeader>
                        <form>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" name="name" required />
                            </div>
                            <div>
                              <Label htmlFor="username">Username</Label>
                              <Input id="username" name="username" required />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" name="email" type="email" required />
                            </div>
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea id="bio" name="bio" />
                            </div>
                          </div>
                          <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              Create User
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {loadingUsers ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 text-sm py-4">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image_url || user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.username && `@${user.username}`}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.banned ? "destructive" : "default"}>{user.banned ? "banned" : "active"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "secondary" : "outline"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                                {user.status === "active" ? "Suspend User" : "Activate User"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleRole(user.id, user.role)}>
                                {user.role === "admin" ? "Set as User" : "Set as Admin"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage recipe categories</CardDescription>
                  </div>
                  <Dialog 
                    open={isDialogOpen} 
                    onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (!open) {
                        setEditingCategory(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCategory(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCategory ? 'Edit Category' : 'Create New Category'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCategory 
                            ? 'Update the category information' 
                            : 'Add a new recipe category'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        if (editingCategory) {
                          handleUpdateCategory(editingCategory.id, formData);
                        } else {
                          handleCreateCategory(formData);
                        }
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              required 
                              defaultValue={editingCategory?.name || ''}
                              placeholder="e.g., Italian Cuisine"
                            />
                          </div>
                          <div>
                            <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                            <Input 
                              id="slug" 
                              name="slug" 
                              defaultValue={editingCategory?.slug || ''}
                              placeholder="e.g., italian-cuisine (auto-generated if empty)"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Leave empty to auto-generate from name
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              id="description" 
                              name="description" 
                              defaultValue={editingCategory?.description || ''}
                              placeholder="Describe this category..."
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsDialogOpen(false);
                              setEditingCategory(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingCategory ? 'Update Category' : 'Create Category'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Recipe Count</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingCategories ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 text-sm py-8">
                          Loading categories...
                        </TableCell>
                      </TableRow>
                    ) : categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 text-sm py-8">
                          No categories found. Create your first category!
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{category.slug}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {MOCK_RECIPES.filter(r => r.categoryId === category.id.toString()).length}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  Edit Category
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()} 
                                      className="text-red-600"
                                    >
                                      Delete Category
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the category "{category.name}" and may affect associated recipes.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
                    {MOCK_REPORTED.map((report) => (
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
                            </Button>
                            <Button variant="outline" size="icon" className="text-green-600">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-600">
                              <X className="h-4 w-4" />
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
      <Toaster />
    </div>
  )
}