import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { ClipInterface } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<ClipInterface>;
	constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
		this.clipsCollection = db.collection('clips');
	}

	createClip(data: ClipInterface): Promise<DocumentReference<ClipInterface>> {
		return this.clipsCollection.add(data);
	}
	getUserClips() {
		return this.auth.user.pipe(
			switchMap((user) => {
				if (!user) {
					return of([]);
				}
				const query = this.clipsCollection.ref.where('uid', '==', user.uid);
				return query.get();
			})
		);
	}
}
