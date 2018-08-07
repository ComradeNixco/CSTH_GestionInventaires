import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


/**
 * Module used for material's modules importation, prevents polution of app module
 *
 * @author Nicolas Lapointe <nixcocpp@gmail.com>
 */
@NgModule({
  imports: [
    CommonModule
  ],
})
export class MaterialImportModule { }
