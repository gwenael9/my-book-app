import { StatusPipe } from '@/pipes/status.pipe';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Book } from '../models/book.model';
import { BookCardComponent } from './book.card.component';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;
  let routerNavigateSpy: jasmine.Spy;

  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    author: 'John Doe',
    status: 'free',
    description: 'Test description',
    ownerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    availableAt: new Date(),
    available: true,
    image: 1,
    userId: undefined,
  };

  beforeEach(async () => {
    routerNavigateSpy = jasmine.createSpy('navigate');

    await TestBed.configureTestingModule({
      imports: [BookCardComponent, StatusPipe],
      providers: [{ provide: Router, useValue: { navigate: routerNavigateSpy } }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    component.book = mockBook;
    component.withTag = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book title and author', () => {
    const titleEl = fixture.debugElement.query(By.css('h3')).nativeElement;
    const authorEl = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(titleEl.textContent).toContain(mockBook.title);
    expect(authorEl.textContent).toContain(mockBook.author);
  });

  it('should call router.navigate on card click', () => {
    const card: DebugElement = fixture.debugElement.query(By.css('div[role="button"]'));
    card.triggerEventHandler('click', null);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/books', mockBook.id]);
  });

  it('should set imageLoaded signal to true after onImageLoad', fakeAsync(() => {
    expect(component.imageLoaded()).toBe(false);
    component.onImageLoad();
    tick(1000);
    expect(component.imageLoaded()).toBe(true);
  }));
});
