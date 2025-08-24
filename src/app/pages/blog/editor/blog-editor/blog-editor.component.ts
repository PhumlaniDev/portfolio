import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [EditorComponent, FormsModule],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js',
    },
  ],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent {
  blogContent = '';

  editorConfig: EditorComponent['init'] = {
    height: 500,
    menubar: true,
    plugins: 'licensekeymanager lists link image table code help wordcount preview fullscreen emoticons',
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
      // const formData = new FormData();
      // formData.append('file', blobInfo.blob(), blobInfo.filename());

      // const response = await fetch('http://localhost:3000/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // const result = await response.json();
      // if (result?.location) {
      //   return result.location; // must be a URL
      // }
      // throw new Error('Image upload failed');
    },
  };
}
