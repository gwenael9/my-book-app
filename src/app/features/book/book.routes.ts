import { Routes } from '@angular/router';
import { authGuard } from '@/guards/auth.guard';
import { BookCreateComponent } from './components/book.create.component';
import { BookListComponent } from './view/book.all.view';
import { BookPublicationComponent } from './view/book.publication.view';

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
  {
    path: 'publication',
    canActivate: [authGuard],
    component: BookPublicationComponent,
  },
];
