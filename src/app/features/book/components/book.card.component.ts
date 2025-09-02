import { Component, Input } from '@angular/core';

import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  template: `
    <div class="border border-primary p-2 rounded-lg">
      <h3>{{ book.title }}</h3>
      <p>Author: {{ book.author }}</p>
      <p>Status: {{ book.status }}</p>
    </div>
  `,
})
export class BookCardComponent {
  @Input() book!: Book;
}
