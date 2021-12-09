import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  offerForm: FormGroup;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/places/offers');
        return;
      }
      this.placeService.getPlace(params.get('placeId')).subscribe((places) => {
        this.place = places;
      });

      this.EditFormData();
    });
  }

  EditFormData() {
    this.offerForm = new FormGroup({
      title: new FormControl(this.place?.title, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(this.place?.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(this.place?.price, {
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
    });
  }

  OnEditOffer() {
    if (!this.offerForm.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating Place....',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placeService.updatePlace(
          this.place.id,
          this.offerForm.value.title,
          this.offerForm.value.description
        ).subscribe(() => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/offer');
        });
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
