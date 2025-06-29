import { API_BASE } from '@/lib/config'

// TypeScript interfaces for Category
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  createdAt: string
}

export interface CreateCategoryData {
  name: string
  description?: string
  slug?: string
}

export interface UpdateCategoryData {
  name: string
  description?: string
  slug?: string
}

export interface CategoryApiResponse {
  data?: Category | Category[]
  error?: string
  message?: string
}

// Utility function to generate slug from name (same as backend)
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Category API service
export class CategoryApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'CategoryApiError'
  }
}

export const categoryApi = {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE}/api/categories/`)
      
      if (!response.ok) {
        throw new CategoryApiError(
          'Failed to fetch categories',
          response.status
        )
      }
      
      const categories = await response.json()
      return categories as Category[]
    } catch (error) {
      if (error instanceof CategoryApiError) {
        throw error
      }
      throw new CategoryApiError('Network error while fetching categories')
    }
  },

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE}/api/categories/detail/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new CategoryApiError('Category not found', 404, 'NOT_FOUND')
        }
        throw new CategoryApiError(
          'Failed to fetch category',
          response.status
        )
      }
      
      const category = await response.json()
      return category as Category
    } catch (error) {
      if (error instanceof CategoryApiError) {
        throw error
      }
      throw new CategoryApiError('Network error while fetching category')
    }
  },

  /**
   * Create a new category
   */
  async create(data: CreateCategoryData): Promise<Category> {
    try {
      // Auto-generate slug if not provided
      const categoryData = {
        ...data,
        slug: data.slug || generateSlug(data.name)
      }

      const response = await fetch(`${API_BASE}/api/categories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 409) {
          throw new CategoryApiError(
            result.error || 'Category already exists', 
            409, 
            'CONFLICT'
          )
        }
        throw new CategoryApiError(
          result.error || 'Failed to create category',
          response.status
        )
      }
      
      return result as Category
    } catch (error) {
      if (error instanceof CategoryApiError) {
        throw error
      }
      throw new CategoryApiError('Network error while creating category')
    }
  },

  /**
   * Update an existing category
   */
  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE}/api/categories/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new CategoryApiError('Category not found', 404, 'NOT_FOUND')
        }
        if (response.status === 409) {
          throw new CategoryApiError(
            result.error || 'Category name or slug already exists', 
            409, 
            'CONFLICT'
          )
        }
        throw new CategoryApiError(
          result.error || 'Failed to update category',
          response.status
        )
      }
      
      return result as Category
    } catch (error) {
      if (error instanceof CategoryApiError) {
        throw error
      }
      throw new CategoryApiError('Network error while updating category')
    }
  },

  /**
   * Delete a category
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/api/categories/remove/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new CategoryApiError('Category not found', 404, 'NOT_FOUND')
        }
        const result = await response.json()
        throw new CategoryApiError(
          result.error || 'Failed to delete category',
          response.status
        )
      }
      
      // Success - no return value needed for delete
    } catch (error) {
      if (error instanceof CategoryApiError) {
        throw error
      }
      throw new CategoryApiError('Network error while deleting category')
    }
  },

  /**
   * Check if slug is available
   */
  async checkSlugAvailability(slug: string, excludeId?: number): Promise<boolean> {
    try {
      const categories = await this.getAll()
      return !categories.some(category => 
        category.slug === slug && category.id !== excludeId
      )
    } catch (error) {
      throw new CategoryApiError('Failed to check slug availability')
    }
  }
} 