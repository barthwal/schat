import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
//import { SignupPage } from '../pages/signup/signup';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any = LoginPage;
    timer: any;

    constructor(platform: Platform, statusBar: StatusBar, private storage: Storage, private loadingCtrl: LoadingController, splashScreen: SplashScreen) {
        this.storage.length().then((val) => {
            if(val >= 1) {
                var loading = this.loadingCtrl.create({
                    spinner: 'crescent'
                });
                loading.present();
                //console.log("storage key: ", this.storage.keys());

                this.storage.get('id_token').then((val) => {
                    if(val) {
                        var that = this;
                        this.timer = setTimeout(function(){
                            clearTimeout(that.timer);
                            that.rootPage = HomePage;

                            loading.dismiss();
                        }, 1000);
                    }
                });
            }/* else {
                this.rootPage = LoginPage;
            }*/
        });

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}

