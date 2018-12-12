import { Task } from './../models/task';

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'task'
})
export class TaskPipe implements PipeTransform {
  transform(task: Task): string {
    const duration = new Date(Date.now() - task.startTs.getTime());
    return `${task.name} (${duration})`;
  }
}
