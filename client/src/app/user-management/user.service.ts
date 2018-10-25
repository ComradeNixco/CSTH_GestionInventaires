import { UserManagementModule } from './user-management.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: UserManagementModule
})
export class UserService {

  constructor() { }
}
