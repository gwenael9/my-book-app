import { Routes } from '@angular/router';
import { authGuard } from '@/guards/auth.guard';
import { BookListComponent } from './view/book.all.view';
import { BookFormComponent } from './view/book.form.view';
import { BookPublicationComponent } from './view/book.publication.view';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent,
  },
  {
    path: 'add',
    canActivate: [authGuard],
    component: BookFormComponent,
  },
  {
    path: 'publication',
    canActivate: [authGuard],
    component: BookPublicationComponent,
  },
];
