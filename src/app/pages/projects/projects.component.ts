import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Project } from '../../model/project.model';
import { ProjectService } from '../../service/project/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private readonly projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }
}
