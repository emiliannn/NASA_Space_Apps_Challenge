import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadRoutingModule } from './file-upload-routing-module';
import { FileUpload } from './file-upload';
import { StatisticsComponentModule } from '../statistics-component/statistics-component-module';

@NgModule({
  declarations: [
    FileUpload
  ],
  imports: [
    CommonModule,
    FileUploadRoutingModule,
    StatisticsComponentModule
  ],
  exports: [FileUpload]
})
export class FileUploadModule { }
