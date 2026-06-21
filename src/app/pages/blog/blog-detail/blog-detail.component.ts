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
import { Auth, authState } from '@angular/fire/auth';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Timestamp } from 'firebase/firestore';
import { switchMap } from 'rxjs';
import { Blog } from '../../../model/blog.model';
import { BlogService } from '../../../service/blog/blog.service';
import { LightboxComponent } from './lightbox.component';

const ADMIN_EMAIL = 'aphumlani.dev@gmail.com';

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
  private router = inject(Router);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private auth = inject(Auth);

  post = signal<Blog | null>(null);
  isLoading = signal(true);
  error = signal(false);
  lightboxUrl = signal<string | null>(null);
  lightboxCaption = signal('');

  // Auth / admin state
  isAdmin = signal(false);

  // Delete confirmation
  showDeleteConfirm = signal(false);
  isDeleting = signal(false);

  postDate = computed(() => toDate(this.post()?.created_at));
  sanitizedContent = computed((): SafeHtml => {
    const content = this.post()?.content ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  });

  constructor() {
    // Track auth state to conditionally show edit/delete buttons
    authState(this.auth)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.isAdmin.set(user?.email === ADMIN_EMAIL);
      });

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
          { injector: this.injector },
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

  editPost(): void {
    const id = this.post()?.id;
    if (id) {
      this.router.navigate(['/blog/admin/edit', id]);
    }
  }

  requestDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  async confirmDelete(): Promise<void> {
    const id = this.post()?.id;
    if (!id) return;

    this.isDeleting.set(true);
    try {
      await this.blogService.deleteBlog(id);
      this.router.navigate(['/blog']);
    } catch (err) {
      console.error('Failed to delete post:', err);
      this.isDeleting.set(false);
      this.showDeleteConfirm.set(false);
    }
  }
}

export function toDate(value: string | number | Date | Timestamp | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value);
}
