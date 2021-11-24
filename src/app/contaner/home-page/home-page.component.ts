import { Component, OnInit } from '@angular/core';
import { AzureBlobStorageService } from 'src/app/azure-blob-storage.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  // SAS (shared access signatures)
  sas = "";

  picturesList: string[] = [];
  picturesDownloaded: string[] = []

  videosList: string[] = [];
  videoDownloaded: any;

  constructor(private blobService: AzureBlobStorageService) {

  }

  ngOnInit(): void {
    this.reloadImages()
  }

  public setSas(event:any) {
    this.sas = event.target.value
  }

  public imageSelected(event:any) {
    const file:File = event.target.files[0];
    if(file){
      this.blobService.uploadImage(this.sas, file, file.name, () => {
        this.reloadImages()
      })
    }

  }

  public deleteImage (name: string) {
    this.blobService.deleteImage(this.sas, name, () => {
      this.reloadImages()
    })
  }

  public downloadImage (name: string) {
    this.blobService.downloadImage(this.sas, name, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  private reloadImages() {
    this.blobService.listImages(this.sas).then(list => {
      this.picturesList = list
      const array: string[] = []
      this.picturesDownloaded = array

      for (let name of this.picturesList) {
        this.blobService.downloadImage(this.sas, name, blob => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            array.push(reader.result as string)
          }
        })
      }
    })
  }

}
