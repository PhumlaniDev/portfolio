import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../model/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly jsonUrl = 'assets/constants/projects.json';
  private firestore: Firestore = inject(Firestore);

  constructor(private readonly http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    const projectRef = collection(this.firestore, 'projects');
    return collectionData(projectRef, { idField: 'id' }) as Observable<Project[]>;
    // return this.http.get<{ projects: Project[] }>(this.jsonUrl);
  }
}
