import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-blog-detail',
  imports: [MarkdownModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  file = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('id') || '';
    this.file = slug;
  }
}
