import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '@family-tree-workspace/shared-models';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.loadUserFromToken();
  }

  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userSubject.next({
          id: decoded.id,
          email: '',
          role: decoded.role,
        });
      } catch (error) {
        console.error('Invalid token', error);
        this.userSubject.next(null);
      }
    }
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  setUser(token: string) {
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    this.userSubject.next({ id: decoded.id, email: '', role: decoded.role });
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
