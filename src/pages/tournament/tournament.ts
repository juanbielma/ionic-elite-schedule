import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { Teams } from '../pages';
import { EliteApi } from '../../shared/shared';

/*
  Generated class for the Tournament page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-tournament',
    templateUrl: 'tournament.html'
})
export class Tournament {

    tournaments: any = [];

    constructor(
        private nav: NavController,
        private eliteApi: EliteApi,
        private loadingCtrl: LoadingController
    ) { }

    ionViewDidLoad() {
        let loader = this.loadingCtrl.create({
            content: 'Getting tournamnets...'
            
        });
        loader.present().then(() => {
            this.eliteApi.getTournaments().subscribe(data => {
                this.tournaments = data;
                loader.dismiss();
            });
        });  
    }

    itemTapped($event, tourney): void {
        this.nav.push(Teams, tourney);
    }

}
