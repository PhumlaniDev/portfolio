import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Timestamp } from 'firebase/firestore';
import { switchMap } from 'rxjs';
import { Blog } from '../../../model/blog.model';
import { BlogService } from '../../../service/blog/blog.service';
import { LightboxComponent } from './lightbox.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, LightboxComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLDivElement>;

  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  post = signal<Blog | null>(null);
  isLoading = signal(true);
  error = signal(false);
  lightboxUrl = signal<string | null>(null);
  lightboxCaption = signal('');

  postDate = computed(() => toDate(this.post()?.created_at));
  sanitizedContent = computed((): SafeHtml => {
    const content = this.post()?.content ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  });

  constructor() {
    const injector = this.injector;

    effect(() => {
      if (this.post()) {
        afterNextRender(
          () => {
            this.contentRef?.nativeElement?.addEventListener('click', (e: MouseEvent) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'IMG') {
                const img = target as HTMLImageElement;
                this.lightboxUrl.set(img.src);
                this.lightboxCaption.set(img.alt || '');
              }
            });
          },
          { injector },
        );
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug') ?? '';
          return runInInjectionContext(this.injector, () => this.blogService.getBlogBySlug(slug));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (blogs) => {
          if (blogs.length > 0) {
            this.post.set(blogs[0]);
            this.isLoading.set(false);
          } else {
            this.error.set(true);
            this.isLoading.set(false);
          }
        },
        error: () => {
          this.error.set(true);
          this.isLoading.set(false);
        },
      });
  }
}

export function toDate(value: string | number | Date | Timestamp | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value);
}
