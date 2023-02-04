import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserDataInterface } from 'src/app/models/user.model';
@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
	isSubmitting = false;

	name = new FormControl('', [Validators.required, Validators.minLength(3)]);
	email = new FormControl('', [Validators.required, Validators.email]);
	age = new FormControl<number | null>(null, [Validators.required, Validators.min(14)]);
	password = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
	confirm_password = new FormControl('', [Validators.required]);
	showAlert = false;
	alertMsg = 'Please wait! Your account is being created';
	alertColor = 'blue';
	registerForm = new FormGroup({
		name: this.name,
		email: this.email,
		age: this.age,
		password: this.password,
		confirm_password: this.confirm_password,
	});
	constructor(private auth: AuthService) {}

	async register() {
		this.showAlert = true;
		this.alertMsg = 'Please wait! Your account is being created';
		this.alertColor = 'blue';
		this.isSubmitting = true;

		//firebase stuff

		try {
			await this.auth.createUser(this.registerForm.value as UserDataInterface);
		} catch (e) {
			console.error(e);
			this.alertMsg = 'Something went wrong!';
			this.alertColor = 'red';
			this.isSubmitting = false;
			return;
		}
		this.alertMsg = 'Success! Your account has been created';
		this.alertColor = 'green';
	}
}
