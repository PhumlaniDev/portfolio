import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';

import { Blog } from '../../model/blog.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private firestore: Firestore = inject(Firestore);

  addBlog(blog: Omit<Blog, 'published_date' | 'created_at' | 'updated_at'>) {
    const blogsRef = collection(this.firestore, 'blogs');
    return addDoc(blogsRef, {
      ...blog,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      published_date: Timestamp.now(),
    });
  }

  getBlogs(): Observable<Blog[]> {
    const blogsRef = collection(this.firestore, 'blogs');
    return collectionData(blogsRef, { idField: 'id' }) as Observable<Blog[]>;
  }

  getBlogById(id: string): Observable<Blog> {
    const blogDocRef = doc(this.firestore, `blogs/${id}`);
    return docData(blogDocRef, { idField: 'id' }) as Observable<Blog>;
  }
}
