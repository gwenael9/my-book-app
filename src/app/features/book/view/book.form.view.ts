import { AuthService } from '@/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    <h2 class="text-primary font-semibold text-xl mb-2">
      {{ isEditMode ? 'Modifier votre livre' : 'Ajouter un livre' }}
    </h2>
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
            [severity]="isEditMode ? 'warn' : 'success'"
            [label]="isEditMode ? 'Enregistrer' : 'Ajouter'"
            [loading]="loading()"
            [disabled]="bookForm.invalid"
          ></p-button>
        </div>
      </form>
    </div>
  `,
})
export class BookFormComponent implements OnInit {
  @ViewChild('bookForm') bookForm?: NgForm;
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      let book: Book | undefined;
      try {
        book = this.bookService.getBookById(id);
      } catch {
        this.router.navigate(['/books']);
        return;
      }

      if (book.ownerId !== this.authService.currentUser$()?.id) {
        this.router.navigate(['/books']);
        return;
      }

      this.setBookForEdit(book);
    }
  }

  title = '';
  author = '';
  description = '';
  image = 1;
  images = [1, 2, 3, 4];

  isEditMode = false;
  bookId?: number;

  setBookForEdit(book: Book) {
    this.isEditMode = true;
    this.bookId = book.id;
    this.title = book.title;
    this.author = book.author;
    this.description = book.description ?? '';
    this.image = book.image;
  }

  clearForm() {
    this.bookForm?.resetForm();
    this.errorMessage.set(null);
    if (!this.isEditMode) {
      this.title = '';
      this.author = '';
      this.description = '';
      this.image = 1;
    }
  }

  selectImage(i: number) {
    this.image = i;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.loading.set(true);

    const bookData = {
      title: this.title,
      author: this.author,
      description: this.description,
      image: this.image,
    };

    const action$ =
      this.isEditMode && this.bookId
        ? this.bookService.updateBook(this.bookId, bookData)
        : this.bookService.addBook(bookData);

    action$.subscribe({
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
