import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '@family-tree-workspace/shared-models';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.loadUserFromToken();
  }

  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          this.logout();
          return;
        }
        this.userSubject.next({
          id: decoded.id,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          email: '',
          role: decoded.role,
          approved: decoded.approved
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
    this.userSubject.next({ id: decoded.id, first_name: decoded.first_name, last_name: decoded.last_name, email: '', role: decoded.role, approved: decoded.approved });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedFamily');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp >= now;
    } catch (error) {
      return false;
    }
  }
}
