export interface Tag {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export interface BlogPosts {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
  categories: number[];
  tags: number[];
}

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
  categories: Category[];
  tags: Tag[];
}

export interface PaginatedResponse<T> {
  items: T[];
  TotalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchBlogPost {
  id: number;
  title: string;
  description: string;
}