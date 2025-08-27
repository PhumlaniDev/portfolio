import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Blog } from '../../model/blog.model';
import { BlogService } from '../../service/blog/blog.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterModule, MarkdownModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  posts: Blog[] = [];
  selectedPost: Blog | null = null;

  constructor(
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((blogs) => {
      this.posts = blogs
        .filter((blog) => blog.status === 'published')
        .sort((a, b) => {
          const dateA = this.toDate(a.published_date).getTime();
          const dateB = this.toDate(b.published_date).getTime();
          return dateB - dateA;
        });
    });
  }

  private toDate(value: string | number | Date | Timestamp | null | undefined): Date {
    if (!value) return new Date(0);
    if (value instanceof Date) return value;
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date(0);
  }

  selectPost(post: Blog) {
    this.selectedPost = post;
  }

  getSanitizedContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
