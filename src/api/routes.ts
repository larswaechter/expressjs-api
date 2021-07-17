import { Request, Response, Router } from 'express';

import { registerApiRoutes } from './components';
import { registerErrorHandler, registerMiddleware } from './middleware';

/**
 * Init Express REST routes
 *
 * @param {Router} router
 * @returns {void}
 */
export function initRestRoutes(router: Router): void {
	const prefix: string = '/api/v1';

	router.get(prefix, (req: Request, res: Response) => res.send('PING'));

	registerMiddleware(router);
	registerApiRoutes(router, prefix);
	registerErrorHandler(router);
}
