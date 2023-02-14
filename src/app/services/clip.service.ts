import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { ClipInterface } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Injectable({
	providedIn: 'root',
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<ClipInterface>;
	constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
		this.clipsCollection = db.collection('clips');
	}

	createClip(data: ClipInterface): Promise<DocumentReference<ClipInterface>> {
		return this.clipsCollection.add(data);
	}
	getUserClips(sort$: BehaviorSubject<string>) {
		return combineLatest([this.auth.user, sort$]).pipe(
			switchMap((values) => {
				const [user, sort] = values;

				if (!user) {
					return of([]);
				}
				const query = this.clipsCollection.ref
					.where('uid', '==', user.uid)
					.orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
				return query.get();
			}),
			map((snapshot) => (snapshot as QuerySnapshot<ClipInterface>).docs)
		);
	}
	updateClip(id: string, title: string) {
		return this.clipsCollection.doc(id).update({
			title,
		});
	}

	async deleteClip(clip: ClipInterface) {
		const clipRef = this.storage.ref(`clips/${clip.fileName}`);
		await clipRef.delete();
		await this.clipsCollection.doc(clip.docId).delete();
	}
}
