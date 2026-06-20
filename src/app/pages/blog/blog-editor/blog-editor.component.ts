import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Author, Blog } from '../../../model/blog.model';

import { CommonModule } from '@angular/common';
import { BlobInfo } from '../../../model/BlobInfo.model';
import { BlogService } from '../../../service/blog/blog.service';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [EditorComponent, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.js',
    },
  ],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSaving = signal(false);
  isEditMode = signal(false);
  editingId = signal<string | null>(null);
  errorMessage = signal('');

  private currentAuthor: Author = {
    name: 'Phumlani',
    email: 'your@email.com',
    profile_image: 'https://...',
    social_links: {
      linkedin: 'https://linkedin.com/in/...',
      github: 'https://github.com/PhumlaniDev',
    },
  };

  form = this.fb.group({
    title: ['', Validators.required],
    slug: [''],
    excerpt: ['', Validators.required],
    tagsInput: [''],
    coverImageUrl: [''],
    content: ['', Validators.required],
  });

  slugPreview = computed(() => {
    const title = this.form.get('title')?.value ?? '';
    return this.blogService.generateSlug(title);
  });

  tinymceConfig = {
    height: 600,
    menubar: 'file edit view insert format tools table',
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'code',
      'help',
      'wordcount',
    ],
    toolbar:
      'undo redo | blocks | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | ' +
      'link image media | code fullscreen | removeformat help',
    skin: 'oxide-dark',
    content_css: 'dark',

    // Image resize — drag handles enabled
    object_resizing: true,
    image_advtab: true,
    image_dimensions: true,

    // Upload inline images to Firebase Storage
    images_upload_handler: async (blobInfo: BlobInfo): Promise<string> => {
      const file = blobInfo.blob() as File;
      return this.blogService.uploadImage(file);
    },

    // Style content to match dark blog theme
    content_style: `
      body {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 18px;
        line-height: 1.85;
        color: #ccc8c2;
        background: #161616;
        max-width: 760px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      h1, h2, h3, h4 {
        font-family: Georgia, serif;
        color: #e8e6e1;
        letter-spacing: -0.02em;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        display: block;
        margin: 1.5rem auto;
      }
      blockquote {
        border-left: 3px solid #4a4540;
        padding-left: 1.5rem;
        color: #a0998f;
        font-style: italic;
      }
      pre {
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        overflow-x: auto;
      }
      code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875em;
        background: #1e1e1e;
        padding: 0.15em 0.4em;
        border-radius: 4px;
        color: #c9b99a;
      }
      a { color: #c9b99a; }
    `,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editingId.set(id);
      this.blogService.getBlogById(id).subscribe((blog) => {
        if (blog) {
          this.form.patchValue({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            tagsInput: blog.tags.join(', '),
            coverImageUrl: blog.coverImageUrl ?? '',
            content: blog.content,
          });
        }
      });
    }
  }

  isUploadingCover = signal(false);

  async onCoverImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isUploadingCover.set(true);
    try {
      const url = await this.blogService.uploadImage(file);
      this.form.patchValue({ coverImageUrl: url });
    } catch (err) {
      console.error('Cover image upload failed:', err);
      this.errorMessage.set('Cover image upload failed.');
    } finally {
      this.isUploadingCover.set(false);
      input.value = '';
    }
  }

  onTitleChange(): void {
    const title = this.form.get('title')?.value ?? '';
    this.form.patchValue({ slug: this.blogService.generateSlug(title) });
  }

  async saveDraft(): Promise<void> {
    await this.save('draft');
  }

  async publish(): Promise<void> {
    if (this.form.invalid) return;
    await this.save('published');
  }

  private async save(status: 'draft' | 'published'): Promise<void> {
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const values = this.form.value;
      const tags = (values.tagsInput ?? '')
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

      const payload: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'published_date'> = {
        title: values.title ?? '',
        description: values.excerpt ?? '',
        slug: this.blogService.generateSlug(values.title ?? ''),
        excerpt: values.excerpt ?? '',
        content: values.content ?? '',
        coverImageUrl: values.coverImageUrl ?? '',
        author: this.currentAuthor, // inject or hardcode your Author object
        tags,
        status,
        read_time_minutes: this.blogService.estimateReadTime(values.content ?? ''),
      };

      if (this.isEditMode() && this.editingId()) {
        await this.blogService.updateBlog(this.editingId()!, payload);
      } else {
        console.log('Content being saved:', JSON.stringify(values.content));
        await this.blogService.createBlog(payload);
      }

      await this.router.navigate(['/blog/admin']);
    } catch (err) {
      this.errorMessage.set('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      this.isSaving.set(false);
    }
  }
}
