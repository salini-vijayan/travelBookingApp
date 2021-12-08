import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: Place[];
  listloadedPlace: Place[];
  checkedValue:string = 'all';

  constructor(private placeService: PlacesService,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placeService.places;
    this.listloadedPlace = this.loadedPlaces.slice(1);
  }

  //  to access the menu we can use the controller MenuController
  // onOpenMenu(){
  //   this.menuCtrl.toggle() // to open and close the menu
  //   this.menuCtrl.open() // to check whether its open
  //   this.menuCtrl.close() //to close the menu
  // }


  OnFilterUpdate(event: Event) {
    const customEvent = event as CustomEvent<SegmentChangeEventDetail>;
    this.checkedValue = customEvent.detail.value;
  }
}
