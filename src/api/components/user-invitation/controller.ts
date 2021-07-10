import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserInvitation } from './model';
import { UserInvitationRepository } from './repository';

export class UserInvitationController {
	private readonly repo: UserInvitationRepository = new UserInvitationRepository();

	/**
	 * Read user invitations
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUserInvitations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userInvitations: UserInvitation[] = await this.repo.readUserInvitations();

			return res.json({ status: res.statusCode, data: userInvitations });
		} catch (err) {
			return next(err);
		}
	}
}
