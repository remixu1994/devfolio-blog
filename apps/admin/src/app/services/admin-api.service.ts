import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { CreatePostDto, PublicPost } from '@devfolio-blog/shared-types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  getPosts(): Observable<PublicPost[]> {
    return this.http.get<PublicPost[]>(`${this.baseUrl}/admin/posts`);
  }

  createPost(payload: CreatePostDto): Observable<PublicPost> {
    return this.http.post<PublicPost>(`${this.baseUrl}/admin/posts`, payload);
  }
}
