export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  status: 'free' | 'checked out' | 'reserved';
  // l'utilisateur qui prête le livre
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  // date de dispo
  availableAt: Date;
  // l'utilisateur qui l'utilise
  userId?: number;
  available: boolean;
}
