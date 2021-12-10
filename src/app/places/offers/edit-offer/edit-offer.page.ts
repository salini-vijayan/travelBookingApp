import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
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
  placeId: string;
  isLoading: Boolean = false;
  offerForm: FormGroup;
  private placeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/places/offers');
        return;
      }
      this.placeId = params.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeService
        .getPlace(params.get('placeId'))
        .subscribe((places) => {
          this.place = places;
          this.offerForm = new FormGroup({
            title: new FormControl(this.place?.title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.place?.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)],
            }),
            // price: new FormControl(this.place?.price, {
            //   updateOn: 'blur',
            //   validators: [Validators.required],
            // }),
            // dateFrom: new FormControl(null, {
            //   updateOn: 'blur',
            //   validators: [Validators.required],
            // }),
            // dateTo: new FormControl(null, {
            //   updateOn: 'blur',
            //   validators: [Validators.required],
            // }),
          });
          this.isLoading = false;
        },error => {
          this.isLoading = false;
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Places cannot be fetched!. Please try again later.!',
            buttons: [{
              text:'Okay',
              handler: () => {
                this.router.navigateByUrl('/places/offers')
              }
            }]
          })
        });
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
        this.placeService
          .updatePlace(
            this.place.id,
            this.offerForm.value.title,
            this.offerForm.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/offers');
          });
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
