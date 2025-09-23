import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { LoginRequest, RegisterRequest, User } from '../models/user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockUser: User = {
    id: 1,
    name: 'John',
    email: 'john@mail.com',
    role: 'user',
    password: '',
    createdAt: new Date(),
  };

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: MessageService, useValue: messageServiceSpy }],
    });

    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login with correct credentials', (done) => {
      service['users'] = [mockUser];
      service['passwords'] = { [mockUser.email]: 'password' };

      const credentials: LoginRequest = { email: mockUser.email, password: 'password' };

      service.login(credentials).subscribe((user) => {
        expect(user.email).toBe(mockUser.email);
        expect(localStorage.getItem('token')).toBeTruthy();
        expect(messageServiceSpy.add).toHaveBeenCalled();
        done();
      });
    });

    it('should throw error with wrong password', (done) => {
      service['users'] = [mockUser];
      service['passwords'] = { [mockUser.email]: 'wrong' };

      const credentials: LoginRequest = { email: mockUser.email, password: 'password' };

      service.login(credentials).subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          expect(messageServiceSpy.add).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('register', () => {
    it('should register new user', (done) => {
      const userData: RegisterRequest = {
        name: 'New User',
        email: 'new@mail.com',
        password: 'password',
      };

      service.register(userData).subscribe((user) => {
        expect(user.email).toBe(userData.email);
        expect(service['users'].length).toBeGreaterThan(0);
        expect(messageServiceSpy.add).toHaveBeenCalled();
        done();
      });
    });

    it('should not register if email already exists', (done) => {
      service['users'] = [mockUser];

      const userData: RegisterRequest = {
        name: 'John',
        email: mockUser.email,
        password: 'secret',
      };

      service.register(userData).subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toBe('Cet email est déjà utilisé');
          done();
        },
      });
    });
  });

  describe('logout', () => {
    it('should clear user and token', () => {
      localStorage.setItem('token', 'abc');
      service['currentUser'].set(mockUser);

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(service['currentUser']()).toBeNull();
      expect(messageServiceSpy.add).toHaveBeenCalled();
    });

    it('should not show toast if withoutToast is true', () => {
      service.logout(true);
      expect(messageServiceSpy.add).not.toHaveBeenCalled();
    });
  });

  describe('getUserNameById', () => {
    it('should return user name if found', () => {
      service['users'] = [mockUser];
      expect(service.getUserNameById(1)).toBe('John');
    });

    it('should return "Utilisateur inconnu" if not found', () => {
      service['users'] = [];
      expect(service.getUserNameById(99)).toBe('Utilisateur inconnu');
    });
  });

  describe('deleteUser', () => {
    it('should delete own account', (done) => {
      service['users'] = [mockUser];
      service['currentUser'].set(mockUser);

      service.deleteUser(mockUser.id).subscribe(() => {
        expect(service['users'].length).toBe(0);
        expect(messageServiceSpy.add).toHaveBeenCalled();
        done();
      });
    });

    it('should throw error if user not found', (done) => {
      service['users'] = [];
      service['currentUser'].set(mockUser);

      service.deleteUser(99).subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        },
      });
    });
  });
});
