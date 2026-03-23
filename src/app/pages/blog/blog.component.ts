import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup'; // HTML/XML
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import 'prismjs/plugins/autoloader/prism-autoloader';

import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FieldValue, Timestamp } from 'firebase/firestore';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import Prism from 'prismjs';
import { Blog } from '../../model/blog.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { BlogService } from '../../service/blog/blog.service';
import { LoadingService } from '../../service/spinner/loading.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule, TimeAgoPipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit, AfterViewChecked {
  posts: Blog[] = [];
  selectedPost: Blog | null = null;
  sanitizedContent: SafeHtml | null = null;
  lastPostId: string | null = null;

  constructor(
    private blogService: BlogService,
    private loading: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngAfterViewChecked(): void {
    if (this.selectedPost?.id !== this.lastPostId) {
      this.lastPostId = this.selectedPost?.id ?? null;
      setTimeout(() => {
        Prism.highlightAll();
        this.changeDetectorRef.detectChanges();
      }, 50);
    }
  }

  ngOnInit(): void {
    if (Prism.plugins['autoloader']) {
      Prism.plugins['autoloader'].languages_path = '/assets/prismjs/components/';
    }

    this.loading.show('Fetching blogs...');
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.posts = blogs
          .filter((blog) => blog.status === 'published')
          .sort((a, b) => {
            const dateA = this.toDate(a.published_date).getTime();
            const dateB = this.toDate(b.published_date).getTime();
            return dateB - dateA;
          });
        this.loading.hide();
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        this.loading.hide();
      },
    });

    // setTimeout(() => {
    //   this.loading.hide();
    //   this.blogService.getBlogs().subscribe((blogs) => {
    //     this.posts = blogs
    //       .filter((blog) => blog.status === 'published')
    //       .sort((a, b) => {
    //         const dateA = this.toDate(a.published_date).getTime();
    //         const dateB = this.toDate(b.published_date).getTime();
    //         return dateB - dateA;
    //       });
    //   });
    // }, 1500);
  }

  private toDate(value: string | number | Date | Timestamp | null | undefined | FieldValue): Date {
    if (!value) return new Date(0);
    if (value instanceof Date) return value;
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date(0);
  }

  selectPost(post: Blog) {
    this.selectedPost = post;
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
  }
}
