import { BlogPost, BlogService } from '../../service/blog/blog.service';
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterModule, MarkdownModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  selectedPost: BlogPost | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.selectedPost = this.posts[0];
      },
      error: (err) => console.error('Error fetching blog posts', err),
      complete: () => console.log('Blog posts loaded successfully'),
    });
  }

  selectPost(post: BlogPost) {
    this.selectedPost = post;
  }
}
