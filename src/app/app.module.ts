import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { Game, MyTeams, TeamDetail, Tournament, Teams, Standings, TeamHome, Map } from '../pages/pages';
import { Storage } from '@ionic/storage';
import { EliteApi, UserSettingsService } from '../shared/shared';
import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
    declarations: [
        MyApp,
        Game,
        MyTeams,
        TeamDetail,
        Teams,
        Tournament,
        Standings,
        TeamHome,
        Map
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        AgmCoreModule.forRoot({apiKey: 'AIzaSyALI8Ebx605cE4myuWB3WaL23nZp9Mfm8I'})
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Game,
        MyTeams,
        TeamDetail,
        Teams,
        Tournament,
        Standings,
        TeamHome,
        Map
    ],
    providers: [
        Storage,
        EliteApi,
        UserSettingsService
    ]
})
export class AppModule { }
