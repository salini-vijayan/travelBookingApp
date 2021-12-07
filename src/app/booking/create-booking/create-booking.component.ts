import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: Place;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  OnPlaceBook(){
    this.modalCtrl.dismiss({
      message: 'Booked!'
    },'confirm')
  }

  OnCancel(){
    // we can also specify the id of modal
    this.modalCtrl.dismiss(null, 'cancel')
  }

}
