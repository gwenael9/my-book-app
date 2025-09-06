import { Routes } from '@angular/router';
import { authGuard } from '@/guards/auth.guard';
import { BookCreateComponent } from './components/book.create.component';
import { BookListComponent } from './components/book.list.component';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent,
  },
  {
    path: 'add',
    canActivate: [authGuard],
    component: BookCreateComponent,
  },
];
