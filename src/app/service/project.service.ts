import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../model/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly jsonUrl = '../constants/projects.json';

  constructor(private readonly http: HttpClient) {}

  getProjects(): Observable<{ projects: Project[] }> {
    return this.http.get<{ projects: Project[] }>(this.jsonUrl);
  }
}
