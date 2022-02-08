import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, catchError, of } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  // Enables getting a reference to the dom element who's named #fileUpload
  @ViewChild("fileUpload", { static: false })
  fileUpload!: ElementRef;

  public files: any[] = [];

  public uploadedImageName: any;
  @Output () childEvent = new EventEmitter<string>();

  constructor(private uploadService: UploadService, private toastr: ToastrService) { }


  onClick() {

    this.files = [];

    const fileUpload = this.fileUpload.nativeElement;

    fileUpload.onchange = () => {

      for (let index = 0; index < fileUpload.files.length; index++) {

        const file = fileUpload.files[index];

        this.files.push({ name: file.name, data: file, inProgress: false, progress: 0 });
      }
      this.uploadFiles();
    };

    fileUpload.click();
  }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('name',file.name)


    file.inProgress = true;
    let observable = this.uploadService.upload(formData);

    observable.pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const total: any = event.total;
            file.progress = Math.round(event.loaded * 100 / total);
            break;
          case HttpEventType.Response:
            return event;
        }
        return
      }),
      catchError((error: HttpErrorResponse): any => {
        this.toastr.error(JSON.stringify(error)), { timeOut: 5000 }
      }));

    observable.subscribe((event: any) => {
      if (typeof (event) === 'object' && event.body) {
        this.uploadedImageName = event.body;
        this.childEvent.emit(this.uploadedImageName);

      }
    });

  }

  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';

    console.log("Amount of files to upload : " + this.files.length);
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }


  ngOnInit(): void {
  }

}
