import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() center = { lat: -34.397, lng: 150.664 };
  @Input() selectable: Boolean = true;
  @Input() closeButtonText: string = 'Cancel';
  @Input() title: string = 'Pick Location';
  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  clickListener: any;
  googleMaps: any;
  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getgoogleMap()
      .then((googleMapsSdk) => {
        this.googleMaps = googleMapsSdk;
        // rendering a map
        const mapEl = this.mapElementRef.nativeElement; // div stored in mapEl
        const map = new googleMapsSdk.Map(mapEl, {
          center: this.center,
          zoom: 16,
        });

        googleMapsSdk.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
        if (this.selectable) {
          // Click event
          this.clickListener = map.addListener('click', (event) => {
            const selectdCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            this.modalCtrl.dismiss(selectdCoords);
          });
        } else {
          // add marker
          const marker = new googleMapsSdk.Marker({
            position: this.center,
            map: map,
            title: 'PickedLocation'
          });
          marker.setMap(map);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  OnCancel() {
    this.modalCtrl.dismiss();
  }
  private getgoogleMap(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK is not available.');
        }
      };
    });
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
}
