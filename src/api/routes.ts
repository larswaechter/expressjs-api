import { registerApiRoutes } from './components';
import { registerErrorHandler, registerMiddleware } from './middleware';

import { Router } from 'express';

/**
 * Init Express REST routes
 *
 * @param {Router} router
 * @returns {void}
 */
export function initRestRoutes(router: Router): void {
	const prefix: string = '/api/v1';

	registerMiddleware(router);
	registerApiRoutes(router, prefix);
	registerErrorHandler(router);
}
