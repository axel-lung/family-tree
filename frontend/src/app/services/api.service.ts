import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person, Relationship, Family, User } from '@family-tree-workspace/shared-models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Authentification
  register(email: string, password: string, role: string, first_name: string, last_name: string, captchaToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { email, password, role, first_name, last_name, captchaToken });
  }

  login(email: string, password: string, captchaToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password, captchaToken });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  // Personnes
  getPersons(familyId: number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons/family/${familyId}`, { headers: this.getHeaders() });
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`, { headers: this.getHeaders() })
  }

  createPerson(person: Partial<Person>): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/persons`, person, { headers: this.getHeaders() });
  }

  updatePerson(id: number, person: Partial<Person>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/persons/${id}`, person, { headers: this.getHeaders() });
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/persons/${id}`, { headers: this.getHeaders() });
  }

  // Relations
  getRelationships(): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(`${this.apiUrl}/relationships`, { headers: this.getHeaders() });
  }

  createRelationship(relationship: Partial<Relationship>): Observable<Relationship> {
    return this.http.post<Relationship>(`${this.apiUrl}/relationships`, relationship, { headers: this.getHeaders() });
  }

  // Family
  getFamilies(): Observable<Family[]> {
    return this.http.get<Family[]>(`${this.apiUrl}/families`, { headers: this.getHeaders() });
  }

  getFamily(id: number): Observable<Family> {
    return this.http.get<Family>(`${this.apiUrl}/families/${id}`, { headers: this.getHeaders() });
  }

  createFamily(family: Partial<Family>): Observable<Family> {
    return this.http.post<Family>(`${this.apiUrl}/families`, family, { headers: this.getHeaders() });
  }

  // Admin
  editUser(id: number, data: any): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${id}`, data, { headers: this.getHeaders() });
  }

  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }
}