import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatSnackBarModule,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatFormFieldModule,
  MatInputModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ]
})
export class MaterialImportModule { }
