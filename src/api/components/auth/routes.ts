import { Router } from 'express';
import { body, param } from 'express-validator';

import { IComponentRoutes } from '../index';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { AuthController } from './controller';

export class AuthRoutes implements IComponentRoutes<AuthController> {
	readonly name: string = 'auth';
	readonly controller: AuthController = new AuthController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.post(
			'/signin',
			body('email').isEmail(),
			body('password').isString(),
			this.authSerivce.validateRequest,
			this.controller.signinUser
		);

		this.router.post(
			'/register/:uuid',
			param('uuid').isUUID(),
			body('email').isEmail(),
			body('firstname').isString(),
			body('lastname').isString(),
			body('password').isString(),
			this.authSerivce.validateRequest,
			this.controller.registerUser
		);

		this.router.post(
			'/invite',
			body('email').isEmail(),
			this.authSerivce.validateRequest,
			this.controller.createUserInvitation
		);

		this.router.post('/unregister', this.authSerivce.isAuthorized(), this.controller.unregisterUser);
	}
}
