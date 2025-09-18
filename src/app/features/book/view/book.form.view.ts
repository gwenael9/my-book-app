import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-form-book',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    CommonModule,
    CarouselModule,
  ],
  template: `
    <h2 class="text-primary font-semibold text-xl mb-2">Ajouter un livre</h2>
    <div class="flex flex-col items-center w-full">
      @if (errorMessage()) {
        <div class="my-1">
          <p-message size="small" severity="error">{{ errorMessage() }}</p-message>
        </div>
      }
      <form class="w-full max-w-[1000px]" #bookForm="ngForm" (ngSubmit)="onSubmit(bookForm)">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
            <textarea
              id="description"
              name="description"
              [(ngModel)]="description"
              autocomplete="off"
              placeholder="Ma description"
              class="p-inputtext p-component resize-none min-h-[200px]"
            ></textarea>
          </div>
          <div class="flex flex-col gap-2 h-full">
            <label class="text-sm" for="image">Image</label>
            <div class="flex justify-center">
              <p-carousel
                [value]="images"
                [numVisible]="2"
                [numScroll]="1"
                [circular]="true"
                [showIndicators]="false"
                [showNavigators]="true"
                class="max-w-[600px]"
                [responsiveOptions]="responsiveOptions"
              >
                <ng-template pTemplate="item" let-i>
                  <div class="flex justify-center">
                    <button type="button" class="relative" (click)="selectImage(i)">
                      <img
                        class="object-cover h-[200px] border rounded-xl overflow-hidden"
                        src="/books/{{ i }}.jpg"
                        alt="Image {{ i }}"
                      />
                      @if (image === i) {
                        <i
                          class="pi pi-check absolute right-2 top-2 text-green-500 rounded-full bg-white p-1"
                        ></i>
                      }
                    </button>
                  </div>
                </ng-template>
              </p-carousel>
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
        next: (book) => this.handleSuccess(book),
        error: (err: Error) => this.handleError(err),
      });
  }

  private handleSuccess(book: Book) {
    this.loading.set(false);
    this.router.navigate([`/books/${book.id}`]);
  }

  private handleError(err: Error) {
    this.errorMessage.set(err?.message || 'Erreur lors de la requête');
    this.loading.set(false);
  }

  responsiveOptions = [
    {
      breakpoint: '768px', // max-width 768px (mobile)
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '1200px', // max-width 1200px (tablette)
      numVisible: 2,
      numScroll: 1,
    },
  ];
}
