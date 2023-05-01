import { Univ3LpPositionProvider } from './providers/univ3-lp-position.provider';
import { AssetProvider } from './providers/asset.provider';
import { AuthGuard } from './auth/auth-guard.provider';
import { AuthProvider } from './auth/auth.provider';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import * as firebase from 'firebase';
import { environment } from '../environments/environment';
import { PortfolioProvider } from './providers/portfolio.provider';
import localeSv from '@angular/common/locales/sv';
import { registerLocaleData } from '@angular/common';
import { ExchangeRateProvider } from './providers/exchange-rate.provider';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(localeSv, 'sv');
firebase.default.initializeApp(environment.firebase);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot({ navAnimation: null }),
        AppRoutingModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        PortfolioProvider,
        ExchangeRateProvider,
        AssetProvider,
        Univ3LpPositionProvider,
        AuthProvider,
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
