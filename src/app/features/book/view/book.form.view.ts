import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-form-book',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, MessageModule, CommonModule],
  template: `
    <h2 class="text-primary font-semibold text-xl mb-2">Ajouter un livre</h2>
    <div class="flex flex-col items-center w-full">
      @if (errorMessage()) {
        <div class="my-1">
          <p-message size="small" severity="error">{{ errorMessage() }}</p-message>
        </div>
      }
      <form class="w-full max-w-[450px]" #bookForm="ngForm" (ngSubmit)="onSubmit(bookForm)">
        <div class="flex flex-col gap-4 mb-8">
          <div class="flex flex-col gap-1">
            <label class="text-sm" for="title">Titre</label>
            <input
              pInputText
              id="title"
              name="title"
              [(ngModel)]="title"
              required
              autocomplete="off"
              placeholder="Mon titre"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm" for="author">Auteur</label>
            <input
              pInputText
              id="author"
              name="author"
              [(ngModel)]="author"
              required
              autocomplete="off"
              placeholder="L'auteur"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm" for="description">Description</label>
            <input
              pInputText
              id="description"
              name="description"
              [(ngModel)]="description"
              autocomplete="off"
              placeholder="Ma description"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700" for="image">Image</label>
            <div class="flex gap-2 flex-wrap">
              @for (i of images; track i.toString()) {
                <button
                  type="button"
                  (click)="selectImage(i)"
                  class="relative border rounded-xl cursor-pointer flex justify-center items-center overflow-hidden transition ring-2 focus:outline-none bg-gray-200"
                  [ngClass]="
                    image === i
                      ? 'ring-primary border-primary'
                      : 'ring-transparent border-gray-300 '
                  "
                >
                  <img
                    class="w-[104px] object-cover"
                    src="/books/{{ i }}.jpg"
                    alt="Image {{ i }}"
                  />
                </button>
              }
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <p-button
            type="submit"
            severity="success"
            label="Ajouter"
            [loading]="loading()"
            [disabled]="bookForm.invalid"
          ></p-button>
        </div>
      </form>
    </div>
  `,
})
export class BookFormComponent {
  @ViewChild('bookForm') bookForm?: NgForm;
  loading = signal<boolean>(false);

  private bookService = inject(BookService);
  errorMessage = signal<string | null>(null);

  router = inject(Router);

  title = '';
  author = '';
  description = '';
  image = 1;

  images = [1, 2, 3, 4];

  clearForm() {
    this.bookForm?.resetForm();
    this.errorMessage.set(null);
  }

  selectImage(i: number) {
    this.image = i;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.loading.set(true);
    this.bookService
      .addBook({
        title: this.title,
        author: this.author,
        description: this.description,
        image: this.image,
      })
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.loading.set(false);
    this.router.navigate(['/books/publication']);
  }

  private handleError(err: Error) {
    this.errorMessage.set(err?.message || 'Erreur lors de la requête');
    this.loading.set(false);
  }
}
