import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { IRepositoryService } from '../index';

import { UserInvitation } from './model';

export class UserInvitationRepository implements IRepositoryService<UserInvitation> {
	readonly repo: Repository<UserInvitation> = getManager().getRepository(UserInvitation);

	/**
	 * Read all user invitations from db
	 *
	 * @param where Find conditions
	 * @returns Returns an array of user invitations
	 */
	@bind
	public readUserInvitations(where: FindConditions<UserInvitation> = {}): Promise<UserInvitation[]> {
		try {
			return this.repo.find({ where });
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain user invitation from db
	 *
	 * @param where Find conditions
	 * @returns Returns a single user invitation
	 */
	@bind
	public readUserInvitation(where: FindConditions<UserInvitation>): Promise<UserInvitation | undefined> {
		try {
			return this.repo.findOne({
				where
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user invitation to db
	 *
	 * @param userInvitation User invitation to save
	 * @returns Returns saved user invitation
	 */
	@bind
	public saveUserInvitation(userInvitation: UserInvitation): Promise<UserInvitation> {
		try {
			return this.repo.save(userInvitation);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete user invitation from db
	 *
	 * @param userInvitation User invitation to delete
	 * @returns Returns deleted user invitation
	 */
	@bind
	public async deleteUserInvitation(userInvitation: UserInvitation): Promise<UserInvitation> {
		try {
			return this.repo.remove(userInvitation);
		} catch (err) {
			throw new Error(err);
		}
	}
}
