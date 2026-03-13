import { Component, OnInit } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BlogService } from '../../../service/blog/blog.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../service/spinner/loading.service';

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
  blogForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private loading: LoadingService,
  ) {}

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      tags: [''],
    });
  }

  editorConfig: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',
    content_style: `
    body { font-family: Georgia, serif; font-size: 16px; }
    pre[class*="language-"] {
      background: #1e1e1e;
      border-radius: 6px;
      padding: 1rem;
      font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
      font-size: 14px;
    }
    code { font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace; }
  `,
    height: 500,
    menubar: true,
    plugins: 'lists link image table codesample help wordcount preview fullscreen emoticons',
    toolbar:
      'undo redo | formatselect | bold italic underline | ' +
      'alignleft aligncenter alignright | bullist numlist outdent indent | ' +
      'removeformat | link image | codesample preview fullscreen | emoticons',
    license_key: 'gpl', // ✅ correct key
    promotion: false,
    skin: 'oxide-dark',
    content_css: 'dark',
    automatic_uploads: true,
    codesample_global_prismjs: true,
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'CSS', value: 'css' },
      { text: 'TypeScript', value: 'typescript' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C#', value: 'csharp' },
      { text: 'C++', value: 'cpp' },
      { text: 'Ruby', value: 'ruby' },
      { text: 'Go', value: 'go' },
      { text: 'PHP', value: 'php' },
      { text: 'Swift', value: 'swift' },
      { text: 'Kotlin', value: 'kotlin' },
      { text: 'Rust', value: 'rust' },
      { text: 'Dart', value: 'dart' },
      { text: 'SQL', value: 'sql' },
      { text: 'Bash', value: 'bash' },
      { text: 'JSON', value: 'json' },
      { text: 'Markdown', value: 'markdown' },
      { text: 'YAML', value: 'yaml' },
    ],
    images_upload_handler: async (blobInfo) => {
      const base64 = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`;
      return Promise.resolve(base64);
    },
  };

  async saveBlog() {
    if (this.blogForm.valid) {
      const formData = this.blogForm.value;
      this.loading.show('Saving blog...');

      const newBlog = {
        title: formData.title ?? '',
        description: formData.description ?? '',
        content: formData.content ?? '',
        author: {
          name: 'Phumlani Arendse',
          email: 'aphumlani.dev@gmail.com',
          profile_image: 'https://i.pravatar.cc/150?img=3',
          social_links: {
            linkedin: 'https://www.linkedin.com/in/phumlani-arendse/',
            github: 'https://github.com/PhumlaniDev',
          },
        },
        tags: formData.tags?.split(',').map((t: string) => ({ name: t.trim() })) || [],
        // created_at: serverTimestamp(),
        // updated_at: serverTimestamp(),
        // published_date: serverTimestamp(),
        status: 'published',
      };

      try {
        await this.blogService.addBlog(newBlog);
        console.log('Blog saved successfully via BlogService!');
        this.blogForm.reset();
      } catch (error) {
        console.error('Error saving blog via BlogService:', error);
      } finally {
        this.loading.hide();
      }
    } else {
      this.blogForm.markAllAsTouched();
    }
  }
}
