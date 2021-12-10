import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Bookings } from './booking.model';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _booking = new BehaviorSubject<Bookings[]>([]);

  get bookings() {
    return this._booking.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://ionic-angular-49c28-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((resData) => {
          console.log(resData);
          const bookings = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookings.push(
                new Bookings(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].placeTitle,
                  resData[key].placeImage,
                  resData[key].firstName,
                  resData[key].lastName,
                  resData[key].guestNumber,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap((bookings) => {
          this._booking.next(bookings);
        })
      );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Bookings(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    let generatedId;
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-49c28-default-rtdb.firebaseio.com/bookings.json',
        {
          ...newBooking,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._booking.next(bookings.concat(newBooking));
        })
      );
    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((booking) => {
    //     this._booking.next(booking.concat(newBooking));
    //   })
    // );
  }

  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://ionic-angular-49c28-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((booking) => {
          this._booking.next(booking.filter((b) => b.id !== bookingId));
        })
      );
    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((booking) => {
    //     this._booking.next(booking.filter((b) => b.id !== bookingId));
    //   })
    // );
  }
}
