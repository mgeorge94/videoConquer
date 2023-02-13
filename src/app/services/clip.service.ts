import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ClipInterface } from '../models/clip.model';
@Injectable({
	providedIn: 'root',
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<ClipInterface>;
	constructor(private db: AngularFirestore) {
		this.clipsCollection = db.collection('clips');
	}

	async createClip(data: ClipInterface) {
		await this.clipsCollection.add(data);
	}
}
