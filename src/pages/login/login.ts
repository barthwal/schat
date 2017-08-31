import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../../pages/signup/signup';
import { ForgetpasswordPage } from '../../pages/forgetpassword/forgetpassword';


import { tokenNotExpired } from 'angular2-jwt';

import { ServerauthProvider } from '../../providers/serverauth/serverauth';
import { ServerchatProvider } from '../../providers/serverchat/serverchat';


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
		private auth: ServerauthProvider,
		private chat: ServerchatProvider) {

		if (tokenNotExpired()) {
			this.chat.socketAuth();
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	login() {
		this.auth.getToken(this.obj).then((status) => {
			if(status) {
				this.chat.socketAuth();
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

