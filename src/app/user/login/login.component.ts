import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	credentials = {
		email: '',
		password: '',
	};
	showAlert = false;
	alertMsg = 'Please wait! Your account is being created';
	alertColor = 'blue';
	isSubmitting = false;
	constructor(private auth: AngularFireAuth) {}

	ngOnInit(): void {}
	async login() {
		this.showAlert = true;
		this.alertMsg = 'Please wait! You are being logged in ';
		this.alertColor = 'blue';
		this.isSubmitting = true;
		try {
			await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
		} catch (e) {
			console.error(e);
			this.alertMsg = 'Something went wrong!';
			this.alertColor = 'red';
			this.isSubmitting = false;
			return;
		}
		this.alertMsg = 'Success! You are now logged in!';
		this.alertColor = 'green';
	}
}
