import { Component, ViewChildDecorator, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import { ClipInterface } from '../models/clip.model';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-clip',
	templateUrl: './clip.component.html',
	styleUrls: ['./clip.component.css'],
	providers: [DatePipe],
})
export class ClipComponent {
	@ViewChild('videoPlayer', { static: true }) target?: ElementRef;
	player?: videojs.Player;
	clip?: ClipInterface;

	constructor(public route: ActivatedRoute) {}

	ngOnInit(): void {
		this.player = videojs(this.target?.nativeElement);
		this.route.params.subscribe((params: Params) => {});
		this.route.data.subscribe((data) => {
			this.clip = data.clip as ClipInterface;

			this.player?.src({
				src: this.clip.url,
				type: 'video/mp4',
			});
		});
	}
}
