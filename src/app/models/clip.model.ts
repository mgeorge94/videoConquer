import firebase from 'firebase/compat';
export interface ClipInterface {
	uid: string;
	displayName: string;
	title: string;
	fileName: string;
	url: string;
	timestamp: firebase.firestore.FieldValue;
	docId?: string;
}
