import {Component, input} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader, MatCardImage,
  MatCardTitle,
  MatCardTitleGroup
} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';
import {Project as ProjectModel} from "../../models/projects";
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-project',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    NgOptimizedImage,
    MatCardTitle,
    MatCardContent,
    MatCardFooter,
    MatIcon,
    MatButton,
    MatCardImage
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class Project {
  project = input.required<ProjectModel>()
}
