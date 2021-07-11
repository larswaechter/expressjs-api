import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../../services/auth';
import { CacheService } from '../../../services/cache';
import { UtilityService } from '../../../services/utility';

import { User } from '../user/model';
import { UserRole } from '../user-role/model';
import { UserRepository } from '../user/repository';

import { UserInvitation } from '../user-invitation/model';
import { UserInvitationRepository } from '../user-invitation/repository';
import { UserInvitationMailService } from '../user-invitation/services/mail';

export class AuthController {
	private readonly authService: AuthService = new AuthService();
	private readonly userInvMailService: UserInvitationMailService = new UserInvitationMailService();
	private readonly cacheService: CacheService = new CacheService();

	private readonly userRepo: UserRepository = new UserRepository();
	private readonly userInvRepo: UserInvitationRepository = new UserInvitationRepository();

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async signinUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, password } = req.body;

			const user: User | undefined = await this.userRepo.read({
				where: {
					email,
					active: true
				}
			});

			// Wrong email or password
			if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
				return res.status(401).json({ status: 401, error: 'Wrong email or password' });
			}

			// Create jwt -> required for further requests
			const token: string = this.authService.createToken(user.id);

			// Don't send user password in response
			delete user.password;

			return res.json({ token, user });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Register new user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { hash } = req.params;
			const { email, firstname, lastname, password } = req.body;

			const invitation: UserInvitation | undefined = await this.getUserInvitation(hash, email);

			if (!invitation) {
				return res.status(403).json({ error: 'Invalid hash' });
			}

			const user: User | undefined = await this.userRepo.read({
				where: {
					email
				}
			});

			if (user) {
				return res.status(400).json({ error: 'Email is already taken' });
			}

			const newUser = new User(email, firstname, lastname, await UtilityService.hashPassword(password), true);
			newUser.userRole = new UserRole(1, 'Admin');

			this.cacheService.delete('user');

			await this.userInvRepo.delete(invitation);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user invitation that is required for registration
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createUserInvitation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.body;

			const user: User | undefined = await this.userRepo.read({
				where: {
					email
				}
			});

			if (user) {
				return res.status(400).json({ error: 'Email is already taken' });
			}

			// UUID for registration link
			const hash = UtilityService.generateUuid();

			await this.userInvRepo.save({
				email,
				hash
			} as UserInvitation);

			await this.userInvMailService.sendUserInvitation(email, hash);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Unregister user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async unregisterUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.user as User;

			const user: User | undefined = await this.userRepo.read({
				where: {
					email
				}
			});

			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			await this.userRepo.delete(user);

			// Clear user cache
			this.cacheService.delete('user');

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Validate hash required for registration
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async validateRegistrationHash(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { hash } = req.params;

			const invitation = await this.getUserInvitation(hash);
			return invitation ? res.status(204).send() : res.status(403).json({ error: 'Invalid hash' });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Get user invitation
	 *
	 * @param hash
	 * @param email
	 * @returns Returns user invitation
	 */
	@bind
	private async getUserInvitation(hash: string, email?: string): Promise<UserInvitation | undefined> {
		try {
			const options = { where: email === undefined ? { hash } : { hash, email } };
			return this.userInvRepo.read(options);
		} catch (err) {
			throw err;
		}
	}
}
