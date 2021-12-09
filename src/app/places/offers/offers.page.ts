import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  offerPlaces : Place[];
  private placesSub: Subscription;

  constructor(private placeService: PlacesService,
    private router: Router) { }

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe(places => {
      this.offerPlaces = places;
    });
  }

  onEditOffer(id:string, slidingItem:IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','offers','edit',id])
    console.log('Edit offer', id)
  }

  /* we have to unsubscribe our own subscriptions
  in order to avoid memmory leaks.*/
  ngOnDestroy(){
    if (this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

}
