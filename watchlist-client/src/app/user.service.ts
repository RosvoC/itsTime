// user.service.ts
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authEmitter = new EventEmitter<boolean>();
  token = localStorage.getItem('token');
  private userUrl = `${environment.backendUrl}/auth/user`; //

  constructor(private http: HttpClient) {}

  getUserInfo(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(this.userUrl, httpOptions);
  }
}
