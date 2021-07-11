import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Router } from 'express';

import { AuthService } from '../../services/auth';
import { CacheService } from '../../services/cache';

import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';
import { UserInvitationRoutes } from './user-invitation/routes';
import { UserRoleRoutes } from './user-role/routes';

export interface IRepositoryService<T> {
	readonly repo: Repository<T>;
	readonly cacheService?: CacheService;
	readonly defaultRelations?: string[];
}

export interface IRepositoryServiceStrict<T> extends IRepositoryService<T> {
	readAll(options: FindManyOptions<T>, cached?: boolean): Promise<T[]>;
	read(options: FindOneOptions<T>): Promise<T | undefined>;
	save(entity: T): Promise<T>;
	delete(entity: T): Promise<T>;
}

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
