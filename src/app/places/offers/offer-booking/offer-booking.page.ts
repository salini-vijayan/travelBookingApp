import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-booking',
  templateUrl: './offer-booking.page.html',
  styleUrls: ['./offer-booking.page.scss'],
})
export class OfferBookingPage implements OnInit,OnDestroy {
  place: Place;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/places/offers/');
        return;
      }
      this.placeSub = this.placeService.getPlace(params.get('placeId'))
      .subscribe((places) => {
        this.place = places;
      });
    });
  }

  ngOnDestroy(): void {
      if(this.placeSub) {
        this.placeSub.unsubscribe();
      }
  }
}
