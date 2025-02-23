import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Project } from '../../model/project.model';
import { ProjectService } from './../../service/project.service';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  projects: Project[] = [];

  constructor(private readonly projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data.projects;
    });
  }
}
