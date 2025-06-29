import { Component } from '@angular/core';
import {projects} from '../../utils/projects';
import {Project} from '../project/project';

@Component({
  selector: 'app-projects',
  imports: [
    Project
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {

  protected readonly projects = projects;
}
