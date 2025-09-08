export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  status: 'free' | 'unavailable' | 'reserved';
  // l'utilisateur qui prête le livre
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  // date de dispo
  availableAt: Date;
  // l'utilisateur qui l'utilise
  userId?: number;
  available: boolean;
  image: number;
}

export interface CreateBook {
  title: string;
  author: string;
  description?: string;
  image: number;
}
