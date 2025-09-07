import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '@/shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastModule],
  template: `
    <app-header></app-header>
    <main class="px-8 py-4">
      <router-outlet></router-outlet>
      <p-toast position="bottom-right"></p-toast>
    </main>
  `,
})
export class App {
  protected readonly title = signal('my-book-app');
}
