import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MyTeams, Tournament, TeamHome } from '../pages/pages';
import { UserSettingsService, EliteApi } from '../shared/shared';
import { Storage } from '@ionic/storage';

@Component( {
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild( Nav ) nav: Nav;

  rootPage: any = MyTeams;
  favoriteTeams = [];

  constructor(
    private platform: Platform,
    private userSettings: UserSettingsService,
    private storage: Storage,
    private eliteApi: EliteApi,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.refreshFavorites();
      this.events.subscribe( 'favorites:changed', () =>
        this.refreshFavorites() );
      Splashscreen.hide();

    });
  }

  refreshFavorites() {
    this.userSettings.getAllFavorites().then(value => {
        this.favoriteTeams = JSON.parse(value);
        console.log( "**Favorites", JSON.stringify( this.favoriteTeams ) );
    });
    
  }
  
  goHome(): void {
    this.nav.popToRoot();
  }

  goToTournaments(): void {
    this.nav.push( Tournament );
  }

  goToTeam( event, favorite ) {
    let loader = this.loadingCtrl.create( {
      content: 'Getting data...',
      dismissOnPageChange: true
    });

    loader.present();
    this.eliteApi.getTournamentData( favorite.tournamentId ).subscribe( t => this.nav.push( TeamHome, favorite.team ) );

  }

}
