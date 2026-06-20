import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Project } from '../../model/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private firestore: Firestore = inject(Firestore);
  project$ = collectionData(collection(this.firestore, 'projects')) as Observable<Project[]>;
}
