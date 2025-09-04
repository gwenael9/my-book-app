import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule, ButtonModule],
  template: `
    <header class="p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h2 class="text-xl font-bold">
          <a routerLink="/home">Home</a>
        </h2>
        <div class="flex space-x-4">
          <p-button
            routerLink="/books"
            icon="pi pi-book"
            styleClass="p-button-rounded p-button-outlined"
          ></p-button>
          <p-button routerLink="/auth" icon="pi pi-user" styleClass="p-button-rounded"></p-button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
