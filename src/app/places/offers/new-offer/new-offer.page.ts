import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.models';
import { PlacesService } from '../../places.service';

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
    });
  }

  OnCreateOffer() {
    if (!this.offerForm.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating Place ...',
      })
      .then(loadingEl => {
        loadingEl.present();
        this.placeService
          .addPlaces(
            this.offerForm.value.title,
            this.offerForm.value.description,
            +this.offerForm.value.price,
            this.offerForm.value.dateFrom,
            this.offerForm.value.dateTo,
            this.offerForm.value.location
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.offerForm.reset();
            this.router.navigateByUrl('/places/offers');
          });
      });
  }

  OnLocationPicked(location: PlaceLocation) {
    if(!location) {
      return null;
    }
    this.offerForm.patchValue({
      location:location
    })
  }
}
