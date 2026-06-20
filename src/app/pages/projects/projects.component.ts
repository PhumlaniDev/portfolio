import { Component, OnInit, inject } from '@angular/core';

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
  private projectService = inject(ProjectService);
  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.project$.subscribe((data) => {
      this.projects = data;
    });
  }
}
