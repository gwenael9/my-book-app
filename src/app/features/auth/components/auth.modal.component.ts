import { Component, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    MessageModule,
  ],
  template: `
    <p-dialog
      [modal]="true"
      [(visible)]="visible"
      (visibleChange)="onVisibleChange($event)"
      [style]="{ width: '25rem' }"
    >
      <ng-template pTemplate="header">
        <div>
          <h2 class="font-semibold text-xl">
            {{ isLogin() ? 'Se connecter' : 'Créer son compte' }}
          </h2>
          <p class="text-gray-500 text-sm italic">Veuillez renseigner vos informations.</p>
        </div>
      </ng-template>

      @if (errorMessage()) {
        <div class="my-1">
          <p-message size="small" severity="error">{{ errorMessage() }}</p-message>
        </div>
      }

      <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
        <div class="flex flex-col gap-4 mb-8">
          <div class="flex flex-col gap-1">
            <label class="text-sm" for="email">Email</label>
            <input
              pInputText
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              autocomplete="off"
              placeholder="mail@example.com"
            />
          </div>

          <div class="flex flex-col gap-1" [class.hidden]="isLogin()">
            <label class="text-sm" for="username">Nom complet</label>
            <input
              pInputText
              id="username"
              name="username"
              [(ngModel)]="username"
              [required]="!isLogin()"
              username
              autocomplete="off"
              placeholder="John Doe"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm" for="password">Mot de passe</label>
            <input
              type="password"
              pInputText
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              autocomplete="off"
            />
          </div>

          <div class="flex flex-col gap-1" [class.hidden]="isLogin()">
            <label class="text-sm" for="confirmPassword">Confirmez le mot de passe</label>
            <input
              type="password"
              pInputText
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              [required]="!isLogin()"
              minlength="6"
              autocomplete="off"
            />
          </div>
          <p class="text-sm italic">
            {{ isLogin() ? 'Pas de compte ?' : 'Déjà un compte ?' }}
            <span role="button" tabindex="0" (click)="swipeForm()" class="underline cursor-pointer">
              {{ isLogin() ? "S'inscrire" : 'Se connecter' }}.
            </span>
          </p>
        </div>

        <div class="flex justify-end gap-2">
          <p-button type="button" variant="text" label="Retour" (click)="close()"></p-button>
          <p-button
            type="submit"
            severity="success"
            label="Confirmer"
            [loading]="loading()"
            [disabled]="authForm.invalid"
          ></p-button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class AuthModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ViewChild('authForm') authForm?: NgForm;

  private authService = inject(AuthService);

  loading = signal<boolean>(false);
  isLogin = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  email = '';
  password = '';
  confirmPassword = '';
  username = '';

  close() {
    this.visible = false;
    this.isLogin.set(true);
    this.clearForm();
    this.visibleChange.emit(this.visible);
  }

  onVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
  }

  clearForm() {
    this.authForm?.resetForm();
    this.errorMessage.set(null);
  }

  swipeForm() {
    this.clearForm();
    this.isLogin.set(!this.isLogin());
  }

  onSubmit(form: NgForm) {
    this.errorMessage.set(null);
    if (!form.valid) return;
    this.loading.set(true);

    if (this.isLogin()) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      });
    } else {
      if (this.password !== this.confirmPassword) {
        this.loading.set(false);
        this.errorMessage.set('Les mots de passe ne correspondent pas');
        return;
      }
      this.authService
        .register({
          email: this.email,
          password: this.password,
          name: this.username,
        })
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err: Error) => this.handleError(err),
        });
    }
  }

  private handleSuccess() {
    this.loading.set(false);
    if (this.isLogin()) {
      this.close();
    }
    this.swipeForm();
  }

  private handleError(err: Error) {
    this.errorMessage.set(err?.message || 'Erreur lors de la requête');
    this.loading.set(false);
    this.password = '';
    this.confirmPassword = '';
  }
}
