import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';

import { Blog } from '../../model/blog.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  // private firestore: Firestore = inject(Firestore);

  constructor(private injector: Injector) {}

  addBlog(blog: Blog) {
    return runInInjectionContext(this.injector, () => {
      const firestore = inject(Firestore);
      const blogsRef = collection(firestore, 'blogs');
      return addDoc(blogsRef, blog);
    });
  }

  getBlogs(): Observable<Blog[]> {
    return runInInjectionContext(this.injector, () => {
      const firestore = inject(Firestore);
      const blogsRef = collection(firestore, 'blogs');
      return collectionData(blogsRef, { idField: 'id' }) as Observable<Blog[]>;
    });
  }

  getBlogById(id: string): Observable<Blog> {
    return runInInjectionContext(this.injector, () => {
      const firestore = inject(Firestore);
      const blogDocRef = doc(firestore, `blogs/${id}`);
      return docData(blogDocRef, { idField: 'id' }) as Observable<Blog>;
    });
  }
}
