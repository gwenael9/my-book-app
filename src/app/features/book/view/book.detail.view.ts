import { AuthService } from '@/auth/services/auth.service';
import { StatusPipe } from '@/shared/pipes/status.pipe';
import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-details',
  imports: [
    CommonModule,
    FormsModule,
    Button,
    StatusPipe,
    TagModule,
    SkeletonModule,
    DialogModule,
    DatePickerModule,
  ],
  template: `
    <div class="mb-4">
      <p-button
        label="Retour"
        icon="pi pi-arrow-left"
        styleClass="p-button-text"
        (click)="goBack()"
      />
    </div>
    @if (book) {
      <div class="mx-auto flex flex-col md:flex-row gap-4">
        <div class="flex w-full md:w-1/2 justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="/books/{{ book.image }}.jpg"
            [alt]="book.title"
            class="max-h-[calc(100vh-200px)] h-[400px] md:h-auto w-auto object-cover"
          />
        </div>

        <div class="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center">
              <h2 class="text-primary font-semibold text-xl">
                {{ book.title }}
                <span class="text-sm italic text-gray-500">({{ book.author }})</span>
              </h2>
              <p-tag
                [value]="(book.status | status).label"
                [severity]="(book.status | status).severity"
                [rounded]="true"
              />
            </div>
            @if (book.description) {
              <p class="text-gray-700 my-4 border min-h-36 p-2 rounded-md">
                {{ book.description }}
              </p>
            } @else {
              <p class="text-gray-500 my-4 border min-h-36 p-2 rounded-md italic">
                Aucune description disponible.
              </p>
            }
          </div>
          <div class="flex-grow ">
            <div class="text-end">
              @if (book.ownerId === currentUser()?.id) {
                <p-button text icon="pi pi-pencil" (click)="editBook()" />
                <p-button text severity="danger" icon="pi pi-trash" (click)="deleteBook()" />
              }
              @if (book.userId === currentUser()?.id) {
                <p-button severity="danger" variant="text" (click)="endLoan()">
                  Terminer l'emprunt
                </p-button>
              }
              @if (book.available && book.ownerId !== currentUser()?.id) {
                <div class="flex justify-end gap-2">
                  <p-button label="Emprunter" (click)="openModal()" />
                </div>
              }
            </div>
          </div>
          <p class="text-xs text-gray-500 text-right">
            {{ book.createdAt | date: 'd MMMM y, HH:mm' }}
          </p>
        </div>
      </div>
    } @else {
      <p class="text-red-500 text-center">Livre introuvable.</p>
    }

    <p-dialog
      header="Choisir la date de fin"
      [(visible)]="showModal"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '350px' }"
      (onHide)="closeModal()"
    >
      <div class="flex flex-col gap-4">
        <p-datepicker
          [(ngModel)]="selectedDate"
          [minDate]="minDate"
          readonlyInput="true"
          appendTo="body"
          showClear="true"
          dateFormat="dd/mm/yy"
        />
        <div class="flex justify-end gap-2">
          <p-button label="Confirmer" (click)="confirmLoan()" [disabled]="!selectedDate" />
        </div>
      </div>
    </p-dialog>
  `,
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private location = inject(Location);
  private authService = inject(AuthService);
  imageLoaded = signal(false);

  currentUser = this.authService.currentUser$;
  private id = Number(this.route.snapshot.paramMap.get('id'));
  book = this.bookService.getBookById(this.id);

  showModal = signal(false);
  selectedDate: Date | undefined = undefined;
  minDate: Date = new Date();

  goBack() {
    this.location.back();
  }

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedDate = undefined;
  }

  confirmLoan() {
    if (this.selectedDate) {
      this.bookService.loanBook(this.book.id, this.selectedDate).subscribe();
      this.closeModal();
      this.router.navigate(['/books/loan']);
    }
  }

  endLoan() {
    this.bookService.returnBook(this.book.id).subscribe((updatedBook) => {
      this.book = updatedBook;
    });
  }

  deleteBook() {
    this.bookService.deleteBook(this.book.id).subscribe({
      next: () => {
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  editBook() {
    this.router.navigate([`/books/${this.book.id}/edit`]);
  }

  onImageLoad() {
    setTimeout(() => this.imageLoaded.set(true), 1000);
  }
}
