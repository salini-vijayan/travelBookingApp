import { Injectable } from '@angular/core';
import { Bookings } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _booking: Bookings[] = [
    new Bookings('b1','p1','abc','Munnar',2)
  ]

  get bookings(){
    return [...this._booking]
  }

  constructor() { }
}
