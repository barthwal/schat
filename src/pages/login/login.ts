import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { SignupPage } from '../../pages/signup/signup';
import { ForgetpasswordPage } from '../../pages/forgetpassword/forgetpassword';
import { Storage } from '@ionic/storage';


import { ServerauthProvider } from '../../providers/serverauth/serverauth';


@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	public obj: { name: string, password: string} = { name: '', password: ''};

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private viewCtrl: ViewController,
		private storage: Storage,
		private auth: ServerauthProvider) {

	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad LoginPage');
	}

	login() {
		this.auth.getToken(this.obj).then((status) => {
			if(status.res) {
				
				this.storage.set("profile", status.profile);
				this.storage.set("id_token", status.token);

				this.navCtrl.setRoot(HomePage);
			}
		});
	}

	gotoPageUserForm (pageName) {
		switch (pageName) {
			case "login":
				this.navCtrl.push(LoginPage).then(() => {
					// first we find the index of the current view controller:
					const index = this.viewCtrl.index;
					// then we remove it from the navigation stack
					this.navCtrl.remove(index);
				});
				break;
			case "signup":
				this.navCtrl.push(SignupPage).then(() => {
					// first we find the index of the current view controller:
					const index = this.viewCtrl.index;
					// then we remove it from the navigation stack
					this.navCtrl.remove(index);
				});
				break;
			
			case "forget":
				this.navCtrl.push(ForgetpasswordPage).then(() => {
					// first we find the index of the current view controller:
					const index = this.viewCtrl.index;
					// then we remove it from the navigation stack
					this.navCtrl.remove(index);
				});
				break;
		}
	}

}

