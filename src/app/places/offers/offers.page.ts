import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offerPlaces : Place[];

  constructor(private placeService: PlacesService,
    private router: Router) { }

  ngOnInit() {
    this.offerPlaces = this.placeService.places;
  }

  onEditOffer(id:string, slidingItem:IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','offers','edit',id])
    console.log('Edit offer', id)
  }

}
