import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: true })
  filePickRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview : Boolean = false;
  selectedImage: string;
  userPicker: Boolean = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));

    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.userPicker = true;
    }
  }

  OnPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickRef.nativeElement.click();
      return;
    }
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt, //asks whether we need device camera or gallery
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64, //img converted to string
    })
      .then((image) => {
        this.selectedImage = image.base64String;
        this.imagePick.emit(image.base64String);
        // if error encountered with base 64  change to DataUrl
      })
      .catch((err) => {
        if (this.userPicker) {
          this.filePickRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChoose(event: Event) {
    // picture fall back for devices that dont have camera
    const pickedFile = (event.target as HTMLInputElement).files[0];
    // convert to base64 string
    if (!pickedFile) {
      return;
    }
    const fileReader = new FileReader();
    /* since the conversion is an async task hence we don't get
    base64 as result but instaed we have to register a onload method
    this anonymous function will executed once file reader is done
    whatever operations it do*/
    fileReader.onload = () => {
      const dataUrl = fileReader.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fileReader.readAsDataURL(pickedFile);
  }
}
