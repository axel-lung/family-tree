import { Injectable } from '@angular/core';
import { Family } from '@family-tree-workspace/shared-models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private readonly FAMILY_KEY = 'selectedFamily';

  private readonly familySubject = new BehaviorSubject<Family>({ id: 0, name: '' });

  constructor() {
    const savedValue = localStorage.getItem(this.FAMILY_KEY);
    if (savedValue) {
      const parsed = JSON.parse(savedValue);
      this.familySubject.next({ id: parsed.id, name: parsed.name });
    }
  }

  getSelectedFamily(): Observable<Family> {
    return this.familySubject.asObservable();
  }

  setSelectedFamily(family: Family): void {
    this.familySubject.next(family);
    localStorage.setItem(this.FAMILY_KEY, JSON.stringify(family));
  }
}
