import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) {
		event.locals.user = null;
	} else {
		// In a real app, verify a JWT or session token. 
		// For this demo, we'll store the user ID in the cookie (simplified).
		const [user] = await db.select().from(users).where(eq(users.id, parseInt(session)));
		
		if (user) {
			event.locals.user = {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			};
		} else {
			event.locals.user = null;
		}
	}

	// Protect dashboard routes
	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.user) {
			return new Response('Redirect', { status: 303, headers: { Location: '/login' } });
		}
	}

	const response = await resolve(event);
	return response;
};
