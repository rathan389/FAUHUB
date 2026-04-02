export type Category = 'sell' | 'buy' | 'accommodation' | 'public';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price?: string;
  imageUrl?: string;
  contact: string;
  createdAt: number;
  category: Category;
  location?: string;
  type?: string; // For public posts: 'job', 'info', etc.
}
