import { Book } from '@/features/book/models/book.model';

export const mockBooks: Book[] = [
  {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    status: 'free',
    ownerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    availableAt: new Date(),
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    status: 'checked out',
    ownerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    availableAt: new Date(),
  },
  {
    id: 3,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    status: 'reserved',
    ownerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    availableAt: new Date(),
  },
];
