import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../../pages/login/login';
import { ForgetpasswordPage } from '../../pages/forgetpassword/forgetpassword';

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
			
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
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
