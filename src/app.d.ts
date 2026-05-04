// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				name: string;
				email: string;
				role: 'admin' | 'dprd' | 'pelaksana' | 'auditor' | 'umum';
			} | null;
		}
		interface PageData {
			user: Locals['user'];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
