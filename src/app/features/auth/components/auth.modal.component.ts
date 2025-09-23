import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    IconField,
    InputIcon,
    PasswordModule,
    FloatLabelModule,
    ReactiveFormsModule,
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
        <div class="mt-1 mb-4">
          <p-message size="small" severity="error">{{ errorMessage() }}</p-message>
        </div>
      }

      <form [formGroup]="authForm" class="mt-1" (ngSubmit)="onSubmit()">
        <div class="flex flex-col gap-6 mb-8">
          <div class="flex flex-col gap-1">
            <p-float-label variant="on">
              <p-iconfield>
                <p-inputicon class="pi pi-envelope" />
                <input
                  pInputText
                  id="email"
                  formControlName="email"
                  autocomplete="off"
                  class="w-full"
                />
                <label for="email">Email</label>
              </p-iconfield>
            </p-float-label>
          </div>

          @if (!isLogin()) {
            <div class="flex flex-col gap-1">
              <p-float-label variant="on">
                <p-iconfield>
                  <p-inputicon class="pi pi-user" />
                  <input
                    pInputText
                    id="username"
                    formControlName="username"
                    autocomplete="off"
                    class="w-full"
                  />
                  <label for="username">Nom d'utilisateur</label>
                </p-iconfield>
              </p-float-label>
            </div>
          }

          <div class="flex flex-col gap-1">
            <p-float-label variant="on">
              <p-iconfield>
                <p-inputicon class="pi pi-key" />
                <input
                  type="password"
                  pInputText
                  id="password"
                  formControlName="password"
                  autocomplete="off"
                  class="w-full"
                />
                <label for="password">Mot de passe</label>
              </p-iconfield>
            </p-float-label>
          </div>

          @if (!isLogin()) {
            <div class="flex flex-col gap-1">
              <p-float-label variant="on">
                <p-iconfield>
                  <p-inputicon class="pi pi-key" />
                  <input
                    type="password"
                    pInputText
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    autocomplete="off"
                    class="w-full"
                  />
                  <label for="confirmPassword">Confirmez le mot de passe</label>
                </p-iconfield>
              </p-float-label>
            </div>
          }

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

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  isLogin = signal(true);
  errorMessage = signal<string | null>(null);

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: [''],
  });

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
    this.authForm.reset();
    this.errorMessage.set(null);
  }

  swipeForm() {
    this.clearForm();
    this.isLogin.set(!this.isLogin());
    if (this.isLogin()) {
      this.authForm.get('username')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
    } else {
      this.authForm.get('username')?.setValidators([Validators.required]);
      this.authForm
        .get('confirmPassword')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.authForm.get('username')?.updateValueAndValidity();
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    this.errorMessage.set(null);
    if (this.authForm.invalid) return;
    this.loading.set(true);

    const { email, username, password, confirmPassword } = this.authForm.value;

    if (this.isLogin()) {
      this.authService.login({ email, password }).subscribe({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      });
    } else {
      if (password !== confirmPassword) {
        this.loading.set(false);
        this.errorMessage.set('Les mots de passe ne correspondent pas');
        return;
      }
      this.authService.register({ email, password, name: username }).subscribe({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      });
    }
  }

  private handleSuccess() {
    this.loading.set(false);
    if (this.isLogin()) this.close();
    this.swipeForm();
  }

  private handleError(err: Error) {
    this.errorMessage.set(err?.message || 'Erreur lors de la requête');
    this.loading.set(false);
    this.authForm.get('password')?.reset();
    this.authForm.get('confirmPassword')?.reset();
  }
}
