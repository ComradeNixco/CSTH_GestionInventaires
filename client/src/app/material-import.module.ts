import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_LABEL_GLOBAL_OPTIONS,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatMenuModule,
  MatIconModule,
  MatSidenavModule
} from '@angular/material';

import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatPasswordStrengthModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatPasswordStrengthModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule
  ],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ]
})
export class MaterialImportModule { }
