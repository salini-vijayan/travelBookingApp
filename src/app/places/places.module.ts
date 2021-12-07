import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import { CreateBookingComponent } from '../booking/create-booking/create-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule
  ],
  declarations: [PlacesPage, CreateBookingComponent],
  /* When a component navigates neither by routing nor by selector , then it has to be
  specified as an entrycomponent */
  /* Reason for this is, it lets angular know that
  this eventually will be created programmatically and that Angular
  should basically be prepared to render that component when we require it to  */
  entryComponents: [CreateBookingComponent]
})
export class PlacesPageModule {}
