import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../../models/user';
import { Message } from '../../models/message';


declare var io;

@Injectable()
export class ServerchatProvider {
	socket: any;
	me: User;
	usersStream: Rx.Observable<User[]> = new Rx.Observable<User[]>();
	usersResponseStream: any;

	messagesStream: Rx.Observable<Message[]> = new Rx.Observable<Message[]>();
	messagesResponseStream: any;
	messages: Rx.Subject<Message> = new Rx.Subject<Message>(); //(null)
	currentMessages: Rx.Subject<Message[]> = new Rx.Subject<Message[]>();
	createMessage: Rx.Subject<Message> = new Rx.Subject<Message>();
	friends: Rx.Subject<User[]> = new Rx.Subject<User[]>();
	currentFriend: Rx.Subject<User> = new Rx.BehaviorSubject<User>(null);
	
	constructor(public http: Http, public e: Events) {
		console.log('Hello ServerchatProvider Provider');
	}


	private initUsersStreams(): void {
		this.usersStream = Rx.Observable.fromEvent(this.socket, 'onlineUsers');

		this.usersStream.subscribe((users) => {
			this.usersResponseStream = Rx.Observable.create((observer) => {
				observer.next(users);
			});

			this.usersResponseStream.subscribe((users: User[]) => {
				this.friends.next(users);
			});
		});
	}

	private initMessagesStreams(): void {
		this.messagesStream = Rx.Observable.fromEvent(this.socket, 'onMessage');

		this.messagesStream.subscribe((message) => {
			this.messagesResponseStream = Rx.Observable.create((observer) => {
				observer.next(message);
			});

			this.messagesResponseStream.subscribe((message: Message) => {
				this.createMessage.next(message);
			});
		});

		this.createMessage.map((message: Message) => {
			return message;
		}).subscribe((message: Message) => {
			this.e.publish('newMessage', true);
			this.messages.next(message);
		});
	}



	private initLoggedInUser(): void {
		let profileData = JSON.parse(localStorage.getItem('profile'));
		if(!profileData) { return; }

		this.me = new User({
			id: profileData.id,
			name: profileData.name,
			avatar: profileData.avatar
		});
	}

	public socketAuth(): void {
		let token = localStorage.getItem('id_token');

		this.socket = io.connect("http://localhost:3357");
		this.socket.on("connect", () => {
			this.socket.emit('authenticate', {token: token});
			this.initUsersStreams();
			this.initMessagesStreams();
			this.initLoggedInUser();
		});
	}

}
