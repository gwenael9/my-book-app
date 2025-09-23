import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';

@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: '<div [appHighlight]="color">Test</div>',
})
class TestComponent {
  color = 'yellow';
}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should apply default highlight color (yellow)', (done) => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    setTimeout(() => {
      expect(element.style.backgroundColor).toBe('yellow');
      done();
    });
  });

  it('should apply bound color (red)', (done) => {
    fixture.componentInstance.color = 'red';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    setTimeout(() => {
      expect(element.style.backgroundColor).toBe('red');
      done();
    });
  });
});
