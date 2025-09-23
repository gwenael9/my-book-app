import { mockUsers } from '@/app/mock-data';
import { capitalizeFirstLetter } from '@/shared/utils/capitalize';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { delay, Observable, of, throwError } from 'rxjs';
import { LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private defaultUsers: User[] = mockUsers;

  private messageService = inject(MessageService);

  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  private defaultPasswords: Record<string, string> = {
    'john@mail.com': 'password',
    'admin@mail.com': 'password',
  };

  private users: User[] = [];
  private passwords: Record<string, string> = {};

  public getAllUsers = computed(() => this.users);

  constructor() {
    this.loadUsersFromLocalStorage();
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.decodeToken(token);
      this.currentUser.set(user);
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      const token = this.generateMockJwt(user);
      localStorage.setItem('token', token);
      this.currentUser.set(user);

      this.messageService.add({
        severity: 'success',
        summary: 'Connexion réussie',
        detail: `Bienvenue ${user.name} !`,
        life: 3000,
      });

      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé.'));
    }

    const existingUserName = this.users.find((u) => u.name === userData.name);
    if (existingUserName) {
      return throwError(() => new Error("Ce nom d'utilisateur est déjà utilisé."));
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
      password: '',
      createdAt: new Date(),
    };

    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    this.saveUserToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Compte créé avec succès',
      detail: `Bienvenue ${newUser.name} !`,
      life: 3000,
    });

    return of(newUser).pipe(delay(500));
  }

  logout(withoutToast = false): void {
    if (!withoutToast) {
      this.messageService.add({
        summary: 'Déconnexion confirmée',
        detail: `À la prochaine ${this.currentUser()?.name} !`,
        life: 3000,
      });
    }

    this.currentUser.set(null);
    localStorage.removeItem('token');
  }

  getUserNameById(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return 'Utilisateur inconnu';
    return capitalizeFirstLetter(user.name);
  }

  deleteUser(userId: number): Observable<void> {
    const userToDelete = this.currentUser;
    if (!userToDelete) return throwError(() => new Error("Vous n'êtes pas connecté."));

    const isMyAccount = userToDelete()?.id === userId;

    if (userToDelete()?.role === 'user' && !isMyAccount)
      return throwError(() => new Error("Vous n'êtes pas autorisé à supprimer cet utilisateur."));

    const userIndex = this.users.findIndex((b) => b.id === userId);
    if (userIndex === -1) return throwError(() => new Error('Utilisateur introuvable.'));

    const user = this.users.find((u) => u.id === userId);

    if (isMyAccount) {
      this.logout(true);
    }

    this.users.splice(userIndex, 1);
    this.saveUserToLocalStorage();

    this.messageService.add({
      severity: 'success',
      summary: 'Utilisateur supprimé',
      detail: isMyAccount
        ? 'Votre compte a bien été supprimé, à une prochaine fois !'
        : `Le compte de ${user?.name} a bien été supprimé !`,
      life: 3000,
    });

    return of(void 0).pipe(delay(100));
  }

  private loadUsersFromLocalStorage(): void {
    const allUsers = localStorage.getItem('allUsers');
    const usersPassword = localStorage.getItem('usersPassword');

    if (allUsers && usersPassword) {
      this.users = JSON.parse(allUsers);
      this.passwords = JSON.parse(usersPassword);
    } else {
      this.users = [...this.defaultUsers];
      this.passwords = { ...this.defaultPasswords };
    }
  }

  private generateMockJwt(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }),
    );
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  private decodeToken(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        password: '',
        createdAt: new Date(),
      };
    } catch {
      return null;
    }
  }

  private saveUserToLocalStorage(): void {
    localStorage.setItem('allUsers', JSON.stringify(this.users));
    localStorage.setItem('usersPassword', JSON.stringify(this.passwords));
  }
}
