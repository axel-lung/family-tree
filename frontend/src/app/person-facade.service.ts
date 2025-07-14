import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Person, Relationship } from '@family-tree-workspace/shared-models';

@Injectable({
  providedIn: 'root',
})
export class PersonFacade {
  private personsCache = new BehaviorSubject<Person[]>([]);
  private selectedPerson = new BehaviorSubject<Person | null>(null);
  private relationshipsCache = new BehaviorSubject<Relationship[]>([]);

  constructor(private apiService: ApiService) {}

  getPersons(familyId: number): Observable<Person[]> {
    if (!this.personsCache.value.length) {
      return this.apiService.getPersons(familyId).pipe(
        tap(persons => this.personsCache.next(persons))
      );
    }
    return this.personsCache.asObservable();
  }

  getPerson(id: number): Observable<Person | null> {
    const cachedPerson = this.personsCache.value.find(p => p.id === id);
    if (cachedPerson) {
      this.selectedPerson.next(cachedPerson);
      return this.selectedPerson.asObservable();
    }
    return this.apiService.getPerson(id).pipe(
      tap(person => this.selectedPerson.next(person))
    );
  }

  createPerson(person: Partial<Person>): Observable<Person> {
    return this.apiService.createPerson(person).pipe(
      tap(newPerson => {
        this.personsCache.next([...this.personsCache.value, newPerson]);
      })
    );
  }

  updatePerson(id: number, person: Partial<Person>): Observable<void> {
    return this.apiService.updatePerson(id, person).pipe(
      tap(() => {
        const updatedPersons = this.personsCache.value.map(p =>
          p.id === id ? { ...p, ...person } : p
        );
        this.personsCache.next(updatedPersons);
      })
    );
  }

  deletePerson(id: number): Observable<void> {
    return this.apiService.deletePerson(id).pipe(
      tap(() => {
        const updatedPersons = this.personsCache.value.map(p =>
          p.id === id ? { ...p, deleted: true } : p
        );
        this.personsCache.next(updatedPersons);
      })
    );
  }

  getRelationships(): Observable<Relationship[]> {
    if (!this.relationshipsCache.value.length) {
      return this.apiService.getRelationships().pipe(
        tap(relationships => this.relationshipsCache.next(relationships))
      );
    }
    return this.relationshipsCache.asObservable();
  }

  createRelationship(relationship: Partial<Relationship>): Observable<Relationship> {
    return this.apiService.createRelationship(relationship).pipe(
      tap(newRelationship => {
        this.relationshipsCache.next([...this.relationshipsCache.value, newRelationship]);
      })
    );
  }
}