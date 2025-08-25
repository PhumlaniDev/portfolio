import { Component, OnInit } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    private firestore: Firestore,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
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
    const blogData = {
      ...this.blogForm.value,
      tags: this.blogForm.value.tags?.split(',').map((t: string, i: number) => ({
        id: `t${i}`,
        name: t.trim(),
        slug: t.trim().toLowerCase().replace(/\s+/g, '-'),
      })),
      author: {
        id: 'author1',
        name: 'Phumlani Arendse',
        email: 'aphumlani.dev@gmail.com',
        profile_image: 'https://i.pravatar.cc/150?img=3',
        social_links: {
          linkedin: 'https://www.linkedin.com/in/phumlani-arendse/',
          github: 'https://github.com/PhumlaniDev',
        },
      },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    const blogsRef = collection(this.firestore, 'blogs');
    await addDoc(blogsRef, blogData);
    console.log('Blog saved successfully!', blogData);
  }
}
