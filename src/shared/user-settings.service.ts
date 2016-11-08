import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import _ from 'lodash';

@Injectable()
export class UserSettingsService {

    constructor(
        private storage: Storage,
        private events: Events
    ) { }

    favoriteTeam( team, tournamentId, tournamentName ) {
        let item = { team: team, tournamentId: tournamentId, tournamentName: tournamentName };
        this.storage.set( team.id, JSON.stringify( item ) );

        this.storage.get( 'favorites' ).then( val => {
            let array: any[] = [];

            if ( val !== null ) {
                array = JSON.parse( val );
                this.storage.remove( 'favorites' );
            }

            array.push( item );

            this.storage.set( 'favorites', JSON.stringify( array ) ).then( v => {
                this.events.publish( 'favorites:changed' );
            });

        })


    }

    unfavoriteTeam( team ) {

        this.storage.remove( team.id );
        this.events.publish( 'favorites:changed' );

        this.storage.get( 'favorites' ).then( val => {

            let array = JSON.parse( val );

            array = this.removeById( team.id, array );

            this.storage.remove( 'favorites' );

            this.storage.set( 'favorites', JSON.stringify( array ) ).then( v => {
                this.events.publish( 'favorites:changed' );
            });
        });

    }

    removeById( teamId, teams: any[] ): any[] {
        var count = 0;
        var index = 0;
        for ( let t of teams ) {
            if ( t.team.id === teamId )
                index = count;

            count++;
        }

        teams.splice( index, 1 );

        return teams;
    }


    isFavoriteTeam( teamId: string ) {
        return this.storage.get( teamId ).then( value => value ? true : false );
    }

    getAllFavorites() {
        return this.storage.get( 'favorites' );
    }
}