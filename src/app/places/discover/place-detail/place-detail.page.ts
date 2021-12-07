import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/booking/create-booking/create-booking.component';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/places/discover');
        return;
      }
      this.place = this.placeService.getPlace(params.get('placeId'));
    });
  }

  OnBookPlace() {
    /* if we reload this page  and hit back btn or the book btn its showing the wrong manimation. It plays
    animation it normally plays when addind a page. It should play sliding down animation.
    For back btn its a bug bt for our own navigation its not a bug, becoz ionicplay forward navigation
    if it dosen't know the previous page or the stack of page is empty */
    /* For the book btn to do backward navigation we can use the navcontroller,
    it uses the ionic router not the angular router, so the right animation is played.
    Another way to do this is by using navcontrol pop, which pop up the last page of the stack
    bt pop won't work if the stack of pages are empty*/

    // this.router.navigateByUrl('/places/discover')
    // this.navCtrl.navigateBack('/places/discover');
    // this.navCtrl.pop()

    // open modal
    this.modalCtrl
      .create({ // creates the modal
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
      })
      .then(modalElmt => {
        modalElmt.present(); // opens the modal
         // eventListener when modal ge dismissed);
        return modalElmt.onDidDismiss();
      }).then(resultData => {
        if(resultData.role === 'confirm') {
          // console.log('Booked!')
        }
      });

  }
}
