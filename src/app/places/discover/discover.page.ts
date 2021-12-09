import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listloadedPlace: Place[];
  relevantPlaces: Place[];
  checkedValue: string = 'all';
  private placesSub: Subscription;

  constructor(
    private placeService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listloadedPlace = this.relevantPlaces.slice(1);
      this.OnFilterUpdate(this.checkedValue);
    });
  }

  //  to access the menu we can use the controller MenuController
  // onOpenMenu(){
  //   this.menuCtrl.toggle() // to open and close the menu
  //   this.menuCtrl.open() // to check whether its open
  //   this.menuCtrl.close() //to close the menu
  // }

  OnFilterUpdate(filter:string) {
    // const customEvent = event as CustomEvent<SegmentChangeEventDetail>;
    this.checkedValue = filter;
    if (this.checkedValue == 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listloadedPlace = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(
        (places) => places.userId !== this.authService.userId
      );
      this.listloadedPlace = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
