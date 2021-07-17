import { Router } from 'express';

import { AuthService } from '../../services/auth';

import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';
import { UserInvitationRoutes } from './user-invitation/routes';
import { UserRoleRoutes } from './user-role/routes';

export interface IComponentRoutes<T> {
	readonly name: string;
	readonly controller: T;
	readonly router: Router;
	authSerivce: AuthService;

	initRoutes(): void;
	initChildRoutes?(): void;
}

/**
 * Init component routes
 *
 * @param {Router} router
 * @param {string} prefix
 * @returns {void}
 */
export function registerApiRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/auth`, new AuthRoutes().router);
	router.use(`${prefix}/users`, new UserRoutes().router);
	router.use(`${prefix}/user-invitations`, new UserInvitationRoutes().router);
	router.use(`${prefix}/user-roles`, new UserRoleRoutes().router);
}
