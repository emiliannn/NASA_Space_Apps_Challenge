import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUpload } from './file-upload';

const routes: Routes = [{ path: '', component: FileUpload }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileUploadRoutingModule { }
