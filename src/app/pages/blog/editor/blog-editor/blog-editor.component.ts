import { Component, OnInit } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BlogService } from '../../../../service/blog/blog.service';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [EditorComponent, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js',
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
    height: 500,
    menubar: true,
    plugins: 'lists link image table code help wordcount preview fullscreen emoticons',
    toolbar:
      'undo redo | formatselect | bold italic underline | ' +
      'alignleft aligncenter alignright | bullist numlist outdent indent | ' +
      'removeformat | link image | code preview fullscreen | emoticons',
    license_key: 'gpl', // ✅ correct key
    promotion: false,
    skin: 'oxide-dark',
    content_css: 'dark',
    automatic_uploads: true,
    images_upload_handler: async (blobInfo) => {
      const base64 = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`;
      return Promise.resolve(base64);
    },
  };

  async saveBlog() {
    if (this.blogForm.valid) {
      const formData = this.blogForm.value;

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
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        published_date: serverTimestamp(),
        status: 'published',
      };

      this.blogService
        .addBlog(newBlog)
        .then(() => {
          console.log('Blog saved successfully via BlogService!', newBlog);
          this.blogForm.reset();
        })
        .catch((error) => {
          console.error('Error saving blog via BlogService:', error);
        });

      // const blogData = {
      // ...this.blogForm.value,
      // tags: this.blogForm.value.tags?.split(',').map((t: string, i: number) => ({
      //   id: `t${i}`,
      //   name: t.trim(),
      //   slug: t.trim().toLowerCase().replace(/\s+/g, '-'),
      // })),
      // author: {
      //   id: 'author1',
      //   name: 'Phumlani Arendse',
      //   email: 'aphumlani.dev@gmail.com',
      //   profile_image: 'https://i.pravatar.cc/150?img=3',
      //   social_links: {
      //     linkedin: 'https://www.linkedin.com/in/phumlani-arendse/',
      //     github: 'https://github.com/PhumlaniDev',
      //   },
      // },
      // created_at: serverTimestamp(),
      // updated_at: serverTimestamp(),
    }

    // const blogsRef = collection(this.firestore, 'blogs');
    // await addDoc(blogsRef, blogData);
    // console.log('Blog saved successfully!', blogData);
  }
}
