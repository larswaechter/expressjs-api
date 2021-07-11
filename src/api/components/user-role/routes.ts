import { Router } from 'express';
import { body } from 'express-validator';

import { IComponentRoutes } from '../index';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { UserRoleController } from './controller';

export class UserRoleRoutes implements IComponentRoutes<UserRoleController> {
	readonly name: string = 'user-role';
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
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readUserRoles
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('name').isString(),
			this.controller.createUserRole
		);
	}
}
