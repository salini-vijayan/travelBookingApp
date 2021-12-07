import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: Place[];

  constructor(private placeService: PlacesService,private menuCtrl: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placeService.places;
  }

  //  to access the menu we can use the controller MenuController
  // onOpenMenu(){
  //   this.menuCtrl.toggle() // to open and close the menu
  //   this.menuCtrl.open() // to check whether its open
  //   this.menuCtrl.close() //to close the menu
  // }

}
