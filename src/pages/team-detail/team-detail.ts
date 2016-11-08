import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { Game } from '../pages';
import _ from 'lodash';
import { EliteApi, UserSettingsService } from '../../shared/shared';
import moment from 'moment';
/*
  Generated class for the TeamDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component( {
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html'
})
export class TeamDetail {
  allGames: any[];
  dateFilter: string;
  games: any[];
  team: any;
  teamStanding: any;
  useDateFilter = false;
  isFollowing = false;
  private tourneyData: any;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private eliteApi: EliteApi,
    private userSettings: UserSettingsService
  ) { }

  ionViewDidLoad() {
    this.team = this.navParams.data;
    this.tourneyData = this.eliteApi.getCurrentTourney();

    this.games = _.chain( this.tourneyData.games )
      .filter( g => g.team1Id === this.team.id || g.team2Id === this.team.id )
      .map( g => {
        let isTeam1 = ( g.team1Id === this.team.id );
        let opponentName = isTeam1 ? g.team2 : g.team1;
        let scoreDisplay = this.getScoreDisplay( isTeam1, g.team1Score, g.team2Score );
        return {
          gameId: g.id,
          opponent: opponentName,
          time: Date.parse( g.time ),
          location: g.location,
          locationUrl: g.locationUrl,
          scoreDisplay: scoreDisplay,
          homeAway: ( isTeam1 ? 'vs.' : 'at' )
        };
      }).value();

    this.allGames = this.games;
    this.teamStanding = _.find( this.tourneyData.standings, { 'teamId': this.team.id });

    this.userSettings.isFavoriteTeam( this.team.id ).then( value => this.isFollowing = value );
  }

  getScoreDisplay( isTeam1, team1Score, team2Score ) {
    if ( team1Score && team2Score ) {
      var teamScore = ( isTeam1 ? team1Score : team2Score );
      var opponentScore = ( !isTeam1 ? team1Score : team2Score );
      var winIndicator = teamScore > opponentScore ? 'w: ' : 'L: ';
      return winIndicator + teamScore + '-' + opponentScore;
    } else {
      return '';
    }
  }

  gameClicked( $event, game ) {
    let sourceGame = this.tourneyData.games.find( g => g.id === game.gameId );
    this.navCtrl.parent.parent.push( Game, sourceGame );
  }

  dateChanged() {
    if ( this.useDateFilter ) 
      this.games = _.filter( this.allGames, g => moment( g.time ).isSame( this.dateFilter, 'day' ) );
    else 
      this.games = this.allGames;
  }

  getScoreWorL( game ) {
    return game.scoreDisplay ? game.scoreDisplay[ 0 ] : '';
  }

  getColorDisplay( game ) {
    return game.scoreDisplay.indexOf( 'W:' ) === 0 ? 'danger' : 'secondary';
  }

  toggleFollow() {
    if ( this.isFollowing ) {
      let confirm = this.alertCtrl.create( {
        title: 'Unfollow?',
        message: 'Are you sure you want to unfollow?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.isFollowing = false;
              
              this.userSettings.unfavoriteTeam( this.team );

              let toast = this.toastCtrl.create( {
                message: 'You have unfollowed this team',
                duration: 2000,
                position: 'bottom'
              });

              toast.present();
            }
          },
          { text: 'No' }
        ]
      });

      confirm.present();      
    } else {
      this.userSettings.favoriteTeam( this.team, this.tourneyData.tournament.id, this.tourneyData.tournament.name ); 
      this.isFollowing = true;
    }    
  }

  refreshAll(refresher) {
    this.eliteApi.refreshCurrentTourney().subscribe(() => {
      refresher.complete();
      this.ionViewDidLoad();
    })
  }

}
