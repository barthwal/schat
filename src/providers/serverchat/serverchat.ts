import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { User } from '../../models/user';
import { Message } from '../../models/message';


declare var io;

@Injectable()
export class ServerchatProvider {
	firstTimeload: boolean = false;
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
	
	constructor(public http: Http, public e: Events, private storage: Storage,) {
		//console.log('Hello ServerchatProvider Provider');
	}


	private initUsersStreams(): void {
		this.usersStream = Rx.Observable.fromEvent(this.socket, 'onlineUsers');

		this.usersStream.subscribe((users) => {
			console.log('usersStream: ', users);

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
			console.log('this is new message: ', message);
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

	public setCurrentFriend(user: User): void {
		this.currentFriend.next(new User(user));
	}

	public getCurrentMessages(user: User): any {
		let msgs: Message[] = [];
		return this.messages.map((message: Message) => {

			if ( (message.recipient.id === user.id && message.sender.id === this.me.id) || (message.recipient.id === this.me.id && message.sender.id === user.id)) {

				msgs.push(new Message(message));
			}
			return msgs;
		});
	}

	public sendMessage(msg: Message): any {
		return new Promise((resolve, reject) => {
			this.socket.emit('sendMessage', msg, (resp) => {
				if (resp.status) {
					this.addOwnMessage(msg);
					resolve();
				} else {
					reject();
				}
			});
		});
	}

	private addOwnMessage(msg: Message): void {
		this.createMessage.next(msg);
	}


	private initLoggedInUser(): void {
		

		this.storage.get('profile').then((val) => {
			if(typeof val != "object")
				val = JSON.parse(val);

			let profileData = val;
			if(!profileData) { return; }

			this.me = new User({
				id: profileData.id,
				name: profileData.name,
				avatar: profileData.avatar
			});
		});
	}

	public socketAuth(): void {
		
		console.log('socket auth', !this.firstTimeload);

		

		this.storage.get('id_token').then((val) => {
			let token = val;

			this.socket = io.connect("http://localhost:3357");
			if(!this.firstTimeload) {
				this.firstTimeload = true;
				this.socket.on("connect", () => {
					console.log('connected success');
					this.socket.emit('authenticate', {token: token});
					this.initUsersStreams();
					this.initMessagesStreams();
					this.initLoggedInUser();
				});
			}
		});
	}

	public logout(): void {
		this.storage.get('id_token').then((val) => {
			let token = val;

			console.log('logout token: ', token);

			this.socket.emit('logoutUser', {token: token}, (resp) => {
				console.log('server back resp: ', resp);

				if (resp.status) {
					this.firstTimeload = false;
					this.storage.clear();
					//this.socket.disconnect();

				
				} else {
					
				}
			});
		});
	}

}
