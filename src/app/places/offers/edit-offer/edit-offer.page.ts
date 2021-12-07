import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  place: Place;

  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService : PlacesService) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      if(!params.has('placeId')){
        this.navCtrl.navigateBack('/places/offers')
        return;
      }
      this.place = this.placeService.getPlace(params.get('placeId'))
    });
  }

}
