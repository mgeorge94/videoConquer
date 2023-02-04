import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserDataInterface } from '../models/user.model';
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private usersCollection: AngularFirestoreCollection<UserDataInterface>;
	public isAuthenticated$: Observable<boolean>;
	public isAuthenticatedWithDelay$: Observable<boolean>;
	constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
		this.usersCollection = db.collection('users');
		this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
		this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
	}

	public async createUser(userData: UserDataInterface) {
		if (!userData.password) {
			throw new Error('password not provided');
		}
		//this function returns a token . without it we will not be able to insert any other info in the user colection
		const userCred = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);

		if (!userCred.user) {
			throw new Error('User cannot be found');
		}
		await this.usersCollection.doc(userCred.user.uid).set({
			name: userData.name,
			email: userData.email,
			age: userData.age,
		});
		//after the process has finished, the user is automatically singed in
		await userCred.user.updateProfile({
			displayName: userData.name,
		});
	}
}
