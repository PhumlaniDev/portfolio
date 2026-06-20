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

import { Component, Injector, OnInit, inject, runInInjectionContext } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FieldValue, Timestamp } from 'firebase/firestore';

import { CommonModule } from '@angular/common';
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
export class BlogComponent implements OnInit {
  posts: Blog[] = [];
  lastPostId: string | null = null;
  router = inject(Router);
  private injector = inject(Injector);

  constructor(
    private blogService: BlogService,
    private loading: LoadingService,
  ) {}

  ngOnInit(): void {
    if (Prism.plugins['autoloader']) {
      Prism.plugins['autoloader'].languages_path = '/assets/prismjs/components/';
    }

    this.loading.show('Fetching blogs...');

    runInjectionContext(this.injector, () => {
      this.blogService.getAllBlogs().subscribe({
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
    });
  }

  private toDate(value: string | number | Date | Timestamp | null | undefined | FieldValue): Date {
    if (!value) return new Date(0);
    if (value instanceof Date) return value;
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date(0);
  }
}
function runInjectionContext(_injector: Injector, arg1: () => void) {
  // Delegate to Angular's runInInjectionContext to execute fn within given injector
  return runInInjectionContext(_injector, arg1);
}
