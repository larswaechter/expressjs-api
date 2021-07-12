import { bind } from 'decko';
import { Repository, FindConditions, getManager, FindManyOptions, FindOneOptions } from 'typeorm';

import { IRepositoryServiceStrict } from '../index';

import { UserInvitation } from './model';

export class UserInvitationRepository implements IRepositoryServiceStrict<UserInvitation> {
	readonly repo: Repository<UserInvitation> = getManager().getRepository(UserInvitation);

	/**
	 * Read all user invitations from db
	 *
	 * @param where Find conditions
	 * @returns User invitations array
	 */
	@bind
	public readAll(where: FindManyOptions<UserInvitation> = {}): Promise<UserInvitation[]> {
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
	 * @returns User invitation
	 */
	@bind
	public read(options: FindOneOptions<UserInvitation>): Promise<UserInvitation | undefined> {
		try {
			return this.repo.findOne(options);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user invitation to db
	 *
	 * @param userInvitation User invitation to save
	 * @returns Saved user invitation
	 */
	@bind
	public save(userInvitation: UserInvitation): Promise<UserInvitation> {
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
	 * @returns Deleted user invitation
	 */
	@bind
	public async delete(userInvitation: UserInvitation): Promise<UserInvitation> {
		try {
			return this.repo.remove(userInvitation);
		} catch (err) {
			throw new Error(err);
		}
	}
}
