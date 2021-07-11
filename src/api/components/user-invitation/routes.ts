import { Router } from 'express';
import { body } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../index';

import { UserInvitationController } from './controller';

export class UserInvitationRoutes implements IComponentRoutes<UserInvitationController> {
	readonly name: string = 'user-invitation';
	readonly controller: UserInvitationController = new UserInvitationController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes() {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readUserInvitations
		);

		this.router.get(
			'/:invitationID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readUserInvitation
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('email').isEmail(),
			body('hash').isUUID(),
			body('active').isBoolean(),
			this.controller.createUserInvitation
		);

		this.router.delete(
			'/:invitationID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'delete'),
			this.controller.deleteUserInvitation
		);
	}
}
