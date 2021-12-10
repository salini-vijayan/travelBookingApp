import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Bookings } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit, OnDestroy {
  loadedBookings: Bookings[];
  isLoading:Boolean = false;
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((booking) => {
      this.loadedBookings = booking;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    this.loadingCtrl
      .create({
        message: 'Cancelling Booking...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.bookingService
          .cancelBooking(bookingId)
          .subscribe(() => {
            loadingEl.dismiss();
          });
      });
  }

  ngOnDestroy(): void {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
