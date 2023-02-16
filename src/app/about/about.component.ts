import { Component } from '@angular/core';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css'],
})
export class AboutComponent {
	joinText: string[];
	constructor() {
		this.joinText = 'Join now and start showing off your gaming greatness!'.split(' ');
	}
}
