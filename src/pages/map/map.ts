import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { EliteApi } from '../../shared/shared';

declare var window: any;
/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class Map {

  map: any;
  
  constructor(
    private navParams: NavParams,
    private eliteApi: EliteApi
  ) { }

  ionViewDidLoad() {
    let games = this.navParams.data;
    let tourneyData = this.eliteApi.getCurrentTourney();
    let location = tourneyData.locations[ games.locationId ];

    this.map = {
      lat: location.latitude,
      lng: location.longitude,
      zoom: 12,
      markerLabel: games.location
    }    

  }

  getDirections() {
    window.location = `geo:${this.map.lat }, ${this.map.lng }; u = 35`;
  }

}
