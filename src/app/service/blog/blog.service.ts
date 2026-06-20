import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Blog } from '../../model/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private firestore = inject(Firestore);

  private blogsCollection = collection(this.firestore, 'blogs');

  /** Fetch all published blogs ordered by date */
  getPublishedBlogs(): Observable<Blog[]> {
    const q = query(
      this.blogsCollection,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Blog[]>;
  }

  /** Fetch all blogs (admin use) */
  getAllBlogs(): Observable<Blog[]> {
    const q = query(this.blogsCollection, orderBy('created_at', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Blog[]>;
  }

  /** Fetch a single blog by slug */
  getBlogBySlug(slug: string): Observable<Blog[]> {
    const q = query(this.blogsCollection, where('slug', '==', slug));
    return collectionData(q, { idField: 'id' }) as Observable<Blog[]>;
  }

  /** Fetch a single blog by ID */
  getBlogById(id: string): Observable<Blog> {
    const blogDoc = doc(this.firestore, `blogs/${id}`);
    return docData(blogDoc, { idField: 'id' }) as Observable<Blog>;
  }

  /** Create a new blog post */
  async createBlog(
    blog: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'published_date'>,
  ): Promise<string> {
    const docRef = await addDoc(this.blogsCollection, {
      ...blog,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      published_date: blog.status === 'published' ? serverTimestamp() : null,
    });
    return docRef.id;
  }

  /** Update an existing blog post */
  async updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
    const blogDoc = doc(this.firestore, `blogs/${id}`);
    await updateDoc(blogDoc, {
      ...blog,
      updated_at: serverTimestamp(),
      ...(blog.status === 'published' ? { published_date: serverTimestamp() } : {}),
    });
  }

  /** Delete a blog post */
  async deleteBlog(id: string): Promise<void> {
    const blogDoc = doc(this.firestore, `blogs/${id}`);
    await deleteDoc(blogDoc);
  }

  /** Upload image to Firebase Storage and return download URL */
  async uploadImage(file: File): Promise<string> {
    const cloudName = 'dvtdxozln';
    const uploadPreset = 'blog_uploads';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'blog-images');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  }

  /** Generate a URL-friendly slug from a title */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /** Estimate read time based on word count */
  estimateReadTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }
}
