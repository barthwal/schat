import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ServerchatProvider } from '../serverchat/serverchat';


@Injectable()
export class ServerauthProvider {
	jwtHelper: JwtHelper;

	constructor(public http: Http, private storage: Storage, private chat: ServerchatProvider) {
		this.jwtHelper = new JwtHelper();
	}


	public getToken(obj: any) : any {
		return new Promise((reslove, reject) => {
			this.http.post("http://localhost:3357/api/generate-token", JSON.stringify(obj))
				.map(res => res.json())
				.subscribe(data => reslove(this.saveToken(data)));
		});
	}

	private saveToken(data: any): any {
		if(data.status) {
			let decodedToken = this.jwtHelper.decodeToken(data.jwt);
			return {res: true, 'profile': JSON.stringify(decodedToken), 'token': data.jwt};
		} else {
			return {res: false, 'profile': null, 'token': null};
		}
	}

	public logout(): void {
		this.storage.clear();
		this.chat.logout();
	}

}
