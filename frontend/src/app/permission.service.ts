import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission } from '@family-tree-workspace/shared-models';
import { environment } from './environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPermissions(userId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  checkPermission(
    userId: number,
    personId: number,
    permission: 'can_create' | 'can_update' | 'can_delete'
  ): Observable<boolean> {
    return this.getPermissions(userId).pipe(
      map((permissions) => {
        const perm = permissions.find((p) => p.person_id === personId);
        return perm ? perm[permission] : false;
      })
    );
  }
}
