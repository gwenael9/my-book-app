import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="bg-primary text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h2 class="text-2xl font-bold">
          <a routerLink="/home">My Book App</a>
        </h2>
        <nav>
          <ul class="flex space-x-4">
            <li><a routerLink="/books">Books</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
