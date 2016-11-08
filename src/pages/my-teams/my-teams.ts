import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { Tournament, TeamHome } from '../pages';
import { EliteApi, UserSettingsService } from '../../shared/shared';
import { Storage } from '@ionic/storage';

/*
  Generated class for the MyTeams page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-my-teams',
    templateUrl: 'my-teams.html'
})
export class MyTeams {

    favorites = [];

    constructor(
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private eliteApi: EliteApi,
        private userSettings: UserSettingsService,
        private storage: Storage
    ) { }

    // ionViewDidLoad() {
    //   this.storage.forEach(( v, k ) => {
    //           this.favorites.push( JSON.parse( v ) );
    //       })
    // }

    ionViewDidEnter() {
        this.userSettings.getAllFavorites().then(value => {
            this.favorites = JSON.parse(value);
        });
    }

    goToTournaments(): void {
        this.navCtrl.push(Tournament);
    }

    favoriteTapped(event, favorite) {
        let loader = this.loadingCtrl.create({
            content: 'Getting data...',
            dismissOnPageChange: true
        });
        loader.present();

        //loader.dismiss();
        this.eliteApi.getTournamentData(favorite.tournamentId)
            .subscribe(t => this.navCtrl.push(TeamHome, favorite.team));
    }
}
