import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { ClipInterface } from '../models/clip.model';
@Injectable({
	providedIn: 'root',
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<ClipInterface>;
	constructor(private db: AngularFirestore) {
		this.clipsCollection = db.collection('clips');
	}

	createClip(data: ClipInterface): Promise<DocumentReference<ClipInterface>> {
		return this.clipsCollection.add(data);
	}
}
