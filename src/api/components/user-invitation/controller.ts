import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserInvitation } from './model';

import { UserInvitationRepository } from './repository';
import { UserInvitationMailService } from './services/mail';

export class UserInvitationController {
	private readonly repo: UserInvitationRepository = new UserInvitationRepository();
	private readonly service: UserInvitationMailService = new UserInvitationMailService();

	/**
	 * Read user invitations
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async readUserInvitations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userInvitations: UserInvitation[] = await this.repo.readAll();

			return res.json(userInvitations);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read user invitation
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async readUserInvitation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { invitationID } = req.params;

			const invitation: UserInvitation | undefined = await this.repo.read({
				where: {
					id: +invitationID
				}
			});

			return res.json(invitation);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user invitation
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async createUserInvitation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, uuid, active } = req.body;

			const invitation = new UserInvitation(undefined, email, uuid, active);
			const newInvitation: UserInvitation = await this.repo.save(invitation);

			this.service.sendUserInvitation(newInvitation.email, newInvitation.uuid);

			return res.json(newInvitation);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete user invitation
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	public async deleteUserInvitation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { invitationID } = req.params;

			const invitation: UserInvitation | undefined = await this.repo.read({
				where: {
					id: +invitationID
				}
			});

			if (!invitation) {
				return res.status(404).json({ error: 'User invitation not found' });
			}

			await this.repo.delete(invitation);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
