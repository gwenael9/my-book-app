import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center">
      <h2 class="text-primary font-semibold text-xl">Welcome to the Home Page</h2>
      <p class="text-gray-500 italic text-sm">This is the home page of the application.</p>
    </div>
  `,
})
export class HomeComponent {}
