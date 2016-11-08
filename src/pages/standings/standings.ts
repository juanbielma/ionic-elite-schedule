import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EliteApi } from '../../shared/shared';
import _ from 'lodash';

/*
  Generated class for the Standings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-standings',
  templateUrl: 'standings.html'
})
export class Standings {
  allStandings: any[];
  standings: any[];
  team: any;
  divisionFilter: string = 'division';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private eliteApi: EliteApi
  ) { }

  ionViewDidLoad() {
    this.team = this.navParams.data;
    let tourneyData = this.eliteApi.getCurrentTourney();
    this.standings = tourneyData.standings;

    this.allStandings = tourneyData.standings;
    this.filterDivision();
  }

  getHeader(record, recordIndex, records) {
    if ( recordIndex === 0 || record.division !== records[ recordIndex - 1 ].division ) {
      return record.division;
    } 
    return null;
  }

  filterDivision() {
    if ( this.divisionFilter === 'all' )
      this.standings = this.allStandings;
    else
      this.standings = _.filter( this.allStandings, s => s.division === this.team.division );
  }
}
