import { Task } from './models/task';

import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Service used to centralize if tasks are runned in BG
 *
 * @export
 * @class TasksService
 */
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _tasks = new Map<string, Task>();
  constructor() { }

  public add(name = '') {
    this._tasks[name] = new Task(name);
  }

  public remove(name = '') {
    this._tasks.get(name).end();
  }

  public isActive(name = ''): Observable<boolean> {
    return of(this._tasks[name] || false);
  }

  public atLeastOneActive(): boolean {
    this._tasks.forEach(isActive => {
      if (isActive) {
        return true;
      }
    });

    return false;
  }

  public get latestTask() {
    return Array.from(this._tasks.values()).pop();
  }
}
