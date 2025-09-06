import { User } from '../features/auth/models/user.model';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@mail.com',
    password: 'password',
    role: 'admin',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@mail.com',
    password: 'password',
    role: 'user',
    createdAt: new Date('2024-01-01'),
  },
];
