import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/booking/booking.service';
import { CreateBookingComponent } from 'src/app/booking/create-booking/create-booking.component';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable: Boolean = false;
  isLoading: Boolean = false;
  private placeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.has('placeId')) {
          this.navCtrl.navigateBack('/places/discover');
          return;
        }
        this.isLoading = true;
        this.placeSub = this.placeService
          .getPlace(params.get('placeId'))
          .subscribe((places) => {
            this.isLoading = false;
            this.place = places;
            this.isBookable = places.userId !== this.authService.userId;
          });
      },
      (error) => {
        this.alertCtl.create({
          header: 'An error occured',
          message: 'Could not load the place',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigateByUrl('/places/discover');
              },
            },
          ],
        }).then (alertEl => alertEl.present());
      }
    );
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

    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  // open modal
  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
      .create({
        // creates the modal
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalElmt) => {
        modalElmt.present(); // opens the modal
        // eventListener when modal ge dismissed);
        return modalElmt.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({
              message: 'Booking Place ...',
            })
            .then((loadingEl) => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.fromDate,
                  data.toDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
