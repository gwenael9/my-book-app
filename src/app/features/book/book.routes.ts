import { authGuard } from '@/guards/auth.guard';
import { Routes } from '@angular/router';
import { BookListComponent } from './view/book.all.view';
import { BookDetailComponent } from './view/book.detail.view';
import { BookFormComponent } from './view/book.form.view';
import { BookLoanComponent } from './view/book.loan.view';
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
  {
    path: 'loan',
    canActivate: [authGuard],
    component: BookLoanComponent,
  },
  {
    path: ':id',
    component: BookDetailComponent,
  },
];
