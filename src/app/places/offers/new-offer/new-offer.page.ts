import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.models';
import { PlacesService } from '../../places.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  offerForm: FormGroup;
  constructor(
    private placeService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.offerForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }

  OnCreateOffer() {
    if (!this.offerForm.valid || !this.offerForm.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating Place ...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placeService
          .addPlaces(
            this.offerForm.value.title,
            this.offerForm.value.description,
            +this.offerForm.value.price,
            this.offerForm.value.dateFrom,
            this.offerForm.value.dateTo,
            this.offerForm.value.location,
            this.offerForm.value.image,
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.offerForm.reset();
            this.router.navigateByUrl('/places/offers');
          });
      });
  }

  OnLocationPicked(location: PlaceLocation) {
    if (!location) {
      return null;
    }
    this.offerForm.patchValue({
      location: location,
    });
  }

  OnImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData == 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.offerForm.patchValue({ image: imageFile });
  }
}
