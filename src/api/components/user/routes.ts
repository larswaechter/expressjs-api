import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { IComponentRoutes } from '../index';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { UserController } from './controller';

export class UserRoutes implements IComponentRoutes<UserController> {
	readonly name: string = 'user';
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
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readUsers
		);

		this.router.get(
			'/search',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			query('username').isString(),
			this.authSerivce.validateRequest,
			this.controller.readUsersByUsername
		);

		this.router.get(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			param('userID').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.readUser
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('email').isEmail(),
			body('firstname').isString(),
			body('lastname').isString(),
			body('password').isString(),
			body('active').isBoolean(),
			this.authSerivce.validateRequest,
			this.controller.createUser
		);

		this.router.put(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'update'),
			param('userID').isNumeric(),
			body('email').isEmail(),
			body('firstname').isString(),
			body('lastname').isString(),
			body('password').isString(),
			body('active').isBoolean(),
			this.authSerivce.validateRequest,
			this.controller.updateUser
		);

		this.router.delete(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'delete'),
			param('userID').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.deleteUser
		);
	}
}
