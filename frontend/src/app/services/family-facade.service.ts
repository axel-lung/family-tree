import { Injectable } from '@angular/core';
import { Family } from '@family-tree-workspace/shared-models';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FamilyFacade {
  private readonly familiesCache = new BehaviorSubject<Family[]>([]);
  private readonly selectedFamily = new BehaviorSubject<Family | null>(null);

  constructor(private readonly apiService: ApiService) {}

  getFamilies(): Observable<Family[]> {
    if (!this.familiesCache.value.length) {
      return this.apiService
        .getFamilies()
        .pipe(tap((families) => this.familiesCache.next(families)));
    }
    return this.familiesCache.asObservable();
  }

  getFamily(id: number): Observable<Family | null> {
    const cachedFamily = this.familiesCache.value.find((f) => f.id === id);
    if (cachedFamily) {
      this.selectedFamily.next(cachedFamily);
      return this.selectedFamily.asObservable();
    }
    return this.apiService
      .getFamily(id)
      .pipe(tap((family) => this.selectedFamily.next(family)));
  }

  createFamily(family: Partial<Family>): Observable<Family> {
    return this.apiService.createFamily(family).pipe(
      tap((newFamily) => {
        this.familiesCache.next([...this.familiesCache.value, newFamily]);
      })
    );
  }
}
