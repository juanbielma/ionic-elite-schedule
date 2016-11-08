import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EliteApi {

    private baseUrl = 'https://elite-schedule-app-api.firebaseio.com/';
    currentTourney: any = {};
    private tourneyData = {};

    constructor(
        private http: Http
    ) { }

    getTournaments(): Observable<any> {
        return this.http.get( `${this.baseUrl}/tournaments.json` )
            .map((res: Response) => {
                return res.json();
            })
    }

    getTournamentData( tourneyId, forceRefresh: boolean = false ): Observable<any> {

        if ( !forceRefresh && this.tourneyData[ tourneyId ] ) {
            this.currentTourney = this.tourneyData[ tourneyId ];
            console.log( '**No need to make Http call, just return the data' );
            return Observable.of( this.currentTourney );
        }

        //dont have data yet
        console.log( '**About to make Http call' );
        return this.http.get( `${this.baseUrl}/tournaments-data/${tourneyId}.json` )
            .map(( res: Response ) => {
                this.tourneyData[tourneyId] = res.json();
                this.currentTourney = this.tourneyData[ tourneyId ];
                return this.currentTourney;
            });
    }

    getCurrentTourney() {
        return this.currentTourney;
    }

    refreshCurrentTourney() {
        return this.getTournamentData( this.currentTourney.tournament.id, true );
    }


}