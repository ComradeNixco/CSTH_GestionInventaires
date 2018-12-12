import { TasksService } from './tasks.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public taskSvc: TasksService) {}

  public get getTbColor(): string {
    if (this.taskSvc.atLeastOneActive()) {
      return 'warn';
    }
    return 'primary';
  }
}
