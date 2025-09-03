import { Routes } from '@angular/router';

import { BookListComponent } from './components/book.list.component';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent,
  },
];
