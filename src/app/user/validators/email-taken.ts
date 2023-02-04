import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';

@Injectable({
	providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
	constructor(private auth: AngularFireAuth) {}
	validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
		//the fetchSignInMethodsForEmail function will return an array of emails that exist in Firebase.
		// if the response.length===0 then the email we provided was not found in the firebase db
		// if the response array has any other length, then the email address exists in the firebase db
		return this.auth.fetchSignInMethodsForEmail(control.value).then((resp) => (resp.length ? { emailTaken: true } : null));
	};
}
