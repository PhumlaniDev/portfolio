import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FieldValue, Timestamp } from 'firebase/firestore';

import { Blog } from '../../model/blog.model';
import { BlogService } from '../../service/blog/blog.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../service/spinner/loading.service';
import { MarkdownModule } from 'ngx-markdown';
import Prism from 'prismjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit, AfterViewChecked {
  posts: Blog[] = [];
  selectedPost: Blog | null = null;

  constructor(
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private loading: LoadingService,
  ) {}

  ngAfterViewChecked(): void {
    const markdownElement = document.querySelector('.prose');
    console.log('Markdown Element:', markdownElement?.innerHTML);
    Prism.highlightAll();
  }

  ngOnInit(): void {
    this.loading.show('Fetching blogs...');
    setTimeout(() => {
      this.loading.hide();
      this.blogService.getBlogs().subscribe((blogs) => {
        this.posts = blogs
          .filter((blog) => blog.status === 'published')
          .sort((a, b) => {
            const dateA = this.toDate(a.published_date).getTime();
            const dateB = this.toDate(b.published_date).getTime();
            return dateB - dateA;
          });
      });
    }, 1500);
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
  }
}
