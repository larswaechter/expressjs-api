import { Router } from 'express';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../index';

import { UserInvitationController } from './controller';

export class UserInvitationRoutes implements IComponentRoutes<UserInvitationController> {
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
			this.authSerivce.hasPermission('userInvitation', 'read'),
			this.controller.readUserInvitations
		);
	}
}
