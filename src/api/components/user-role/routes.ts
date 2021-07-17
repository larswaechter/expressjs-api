import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../helper';

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
			/*this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),*/
			this.controller.readUserRoles
		);

		this.router.get(
			'/:roleID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			param('roleID').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.readUserRole
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('name').isString(),
			this.authSerivce.validateRequest,
			this.controller.createUserRole
		);

		this.router.delete(
			'/:roleID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'delete'),
			param('roleID').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.deleteUserRole
		);
	}
}
