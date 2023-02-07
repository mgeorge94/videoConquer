import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'not-found',
	template: `
		<div
			class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16"
		>
			<div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
				<div class="relative">
					<div>
						<p class="text-9xl text-indigo-400">404</p>
					</div>
					<div class="relative mt-10">
						<div class="">
							<h1 class="my-2 text-white-800 font-bold text-3xl">
								Looks like you've found the
								<span class="text-indigo-200">doorway </span>
								<span class="text-indigo-300">to </span>
								<span class="text-indigo-400">the </span>
								<span class="text-indigo-500">Great </span>
								<span class="text-indigo-600">Nothing </span>
								<span class="text-indigo-700">!</span>
								<span class="text-indigo-800">!</span>
								<span class="text-indigo-900">!</span>
							</h1>
							<p class="my-2 text-gray-300">
								Sorry about that! Please visit our hompage to get where you need to go.
							</p>
							<button
								(click)="navigateTo()"
								class="sm:w-full lg:w-auto my-2  rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
							>
								Take me there!
							</button>
						</div>
					</div>
				</div>
			</div>
			<div>
				<img src="https://i.ibb.co/ck1SGFJ/Group.png" />
			</div>
		</div>
	`,
})
export class NotFoundComponent {
	constructor(public router: Router) {}

	public navigateTo() {
		this.router.navigate(['/']);
	}
}
