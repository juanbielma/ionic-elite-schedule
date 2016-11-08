import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { TeamHome } from '../pages';
import { EliteApi } from '../../shared/shared';
import _ from 'lodash';
/*
  Generated class for the Teams page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html'
})
export class Teams {
  private allTeams: any;
  private allTeamsDivision: any;
  teams: any = [];
  queryText: string = '';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private eliteApi: EliteApi,
    private loadingCtrl:  LoadingController
  ) { }

  ionViewDidLoad() {
    
    let loader = this.loadingCtrl.create( {
      content: 'Getting data...'
    })

    loader.present().then(() => {
      
      let tourney = this.navParams.data;
      this.eliteApi.getTournamentData( tourney.id ).subscribe( data => {
        this.allTeams = data.teams;
        this.allTeamsDivision =
          _.chain( data.teams )
            .groupBy( 'division' )
            .toPairs()
            .map( item => _.zipObject( [ 'divisionName', 'divisionTeams' ], item ) )
            .value();

        this.teams = this.allTeamsDivision;
        
        loader.dismiss();

      });
    });

  }

  itemTapped($event, team): void{
    this.navCtrl.push( TeamHome, team );
  }

  updateTeams() {
    let queryTextLower = this.queryText.toLowerCase();
    let filteredTeams = [];
    _.forEach( this.allTeamsDivision, td => {
      let teams = _.filter( td.divisionTeams, t => ( <any>t ).name.toLowerCase().includes( queryTextLower ) );
      if ( teams.length ) {
        filteredTeams.push( { divisionName: td.divisionName, divisionTeams: teams });
      }
    });

    this.teams = filteredTeams;
  }

}
