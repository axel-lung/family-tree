import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Person, Relationship, Permission, Family } from '@family-tree-workspace/shared-models';
import { environment } from './environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Authentification
  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { email, password, role });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  // Personnes
  getPersons(familyId: number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons/${familyId}`, { headers: this.getHeaders() });
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`, { headers: this.getHeaders() });
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
}