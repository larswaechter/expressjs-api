import { Router } from 'express';

import { IComponentRoutes } from '../index';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { UserController } from './controller';

export class UserRoutes implements IComponentRoutes<UserController> {
	readonly controller: UserController = new UserController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'read'),
			this.controller.readUsers
		);

		this.router.get(
			'/search',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'read'),
			this.controller.readUsersByUsername
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'create'),
			this.controller.createUser
		);

		this.router.get(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'read'),
			this.controller.readUser
		);

		this.router.put(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'update'),
			this.controller.updateUser
		);

		this.router.delete(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'delete'),
			this.controller.deleteUser
		);
	}
}
