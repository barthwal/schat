import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';


@Injectable()
export class ServerauthProvider {
	jwtHelper: JwtHelper;

	constructor(public http: Http) {
		this.jwtHelper = new JwtHelper();
	}


	public getToken(obj: any) : any {
		return new Promise((reslove, reject) => {
			this.http.post("http://localhost:3357/api/generate-token", JSON.stringify(obj))
				.map(res => res.json())
				.subscribe(data => reslove(this.saveToken(data)));
		});
	}

	private saveToken(data: any): boolean {
		if(data.status) {
			let decodedToken = this.jwtHelper.decodeToken(data.jwt);
			localStorage.setItem('profile', JSON.stringify(decodedToken));
			localStorage.setItem('id_token', data.jwt);
			return true;
		} else {
			return false;
		}
	}

	public logout(): void {
		localStorage.removeItem('profile');
		localStorage.removeItem('id_token');
	}

}
