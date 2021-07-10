import { Router } from 'express';

import { IComponentRoutes } from '../index';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { UserRoleController } from './controller';

export class UserRoleRoutes implements IComponentRoutes<UserRoleController> {
	readonly controller: UserRoleController = new UserRoleController();
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
			this.authSerivce.hasPermission('userRole', 'read'),
			this.controller.readUserRoles
		);
		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('userRole', 'create'),
			this.controller.createUserRole
		);
	}
}
