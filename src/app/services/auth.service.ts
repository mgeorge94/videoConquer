import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { delay, map, filter, switchMap } from 'rxjs/operators';
import { UserDataInterface } from '../models/user.model';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private usersCollection: AngularFirestoreCollection<UserDataInterface>;
	public isAuthenticated$: Observable<boolean>;
	public isAuthenticatedWithDelay$: Observable<boolean>;
	private redirect = false;
	constructor(
		private auth: AngularFireAuth,
		private db: AngularFirestore,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.usersCollection = db.collection('users');
		this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
		this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
		this.router.events
			.pipe(
				filter((e) => e instanceof NavigationEnd),
				map(() => this.route.firstChild),
				switchMap((route) => route?.data ?? of({}))
			)
			.subscribe((data) => (this.redirect = data.authOnly ?? false));
	}

	public async createUser(userData: UserDataInterface) {
		if (!userData.password) {
			throw new Error('password not provided');
		}
		//this function returns a token . without it we will not be able to insert any other info in the user collection
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

	public async logout(e?: Event) {
		e && e.preventDefault();
		await this.auth.signOut();
		if (this.redirect) await this.router.navigateByUrl('/');
	}
}
