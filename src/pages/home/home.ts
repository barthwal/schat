import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import * as Rx from 'rxjs/Rx';

import { ServerauthProvider } from '../../providers/serverauth/serverauth';
import { ServerchatProvider } from '../../providers/serverchat/serverchat';

import { User } from '../../models/user';

import { LoginPage } from '../../pages/login/login';
import { ChatareaPage } from '../../pages/chatarea/chatarea';


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public searchQuery: string = '';
	friends: Rx.Subject<User[]> = new Rx.Subject<User[]>();

	constructor(public navCtrl: NavController, public chat: ServerchatProvider, private viewCtrl: ViewController, private auth: ServerauthProvider) {
		
		this.chat.socketAuth();

		//this.friends = chat.friends;
		//this.chatPage = Chat;

	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad HomePage');

		this.friends = this.chat.friends;
	}

	public logout(): void {
		console.log('logout called..');
		this.auth.logout();
		this.navCtrl.push(LoginPage).then(() => {
			// first we find the index of the current view controller:
			const index = this.viewCtrl.index;
			// then we remove it from the navigation stack
			this.navCtrl.remove(index);
		});
	}

	public openChat(user: User): void {
		this.chat.setCurrentFriend(user);
		
		this.navCtrl.push(ChatareaPage);
	}

}
