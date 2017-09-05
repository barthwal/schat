import { Component, ViewChild, ElementRef } from '@angular/core';
import { Content, Events, NavController, NavParams } from 'ionic-angular';

import * as Rx from 'rxjs/Rx';

import { ServerchatProvider } from '../../providers/serverchat/serverchat';

import { Message } from '../../models/message';
import { User } from '../../models/user';

@Component({
	selector: 'page-chatarea',
	templateUrl: 'chatarea.html',
})
export class ChatareaPage {
	@ViewChild(Content) content: Content;

	msg: string;
	msgs: Rx.Subject<Message[]> = new Rx.Subject<Message[]>();
	friend: User;
	me: User;
	el: any;

	timer: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ServerchatProvider, public e: Events, public eleRef: ElementRef,) {
		this.me = this.chat.me;
		this.e.subscribe("newMessage", (e) => {
			this.scrollTo();
		});

		console.log('me: ', this.me);
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad ChatareaPage');
		this.content.resize();
	}

	ionViewWillLeave() {
		this.e.unsubscribe("newMessage", null);
	}

	ngOnInit(): void {
		this.msg = '';
		this.chat.currentFriend.subscribe((user: User) => {
			this.friend = user;

			console.log("cureent friend: ", user);
			this.msgs = this.chat.getCurrentMessages(this.friend);
		});
	}

	ngAfterViewInit(): void {
		this.el = this.eleRef.nativeElement;
	}

	scrollTo(): void {
		var _that = this;

		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			_that.content.scrollToBottom(0); //200ms animation speed
		}, 50);
	}

	sendMessage(): void {
		let msg = new Message({
			isRead: false,
			sender: this.me,
			recipient: this.friend,
			msg: this.msg
		});

		this.chat.sendMessage(msg).then((resp) => {
			this.msg = "";
		});
	}

}





