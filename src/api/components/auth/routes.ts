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

	public constructor(defaultStrategy?: PassportStrategy) {
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
		this.router.get(
			'/register/:hash',
			param('hash').isUUID(),
			this.authSerivce.validateRequest,
			this.controller.validateRegistrationHash
		);
		this.router.post(
			'/register/:hash',
			param('hash').isUUID(),
			body('email').isEmail(),
			body('firstname').isEmail(),
			body('lastname').isEmail(),
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
