import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { AuthService } from '../../../services/auth';
import { CacheService } from '../../../services/cache';
import { UtilityService } from '../../../services/utility';

import { User } from '../user/model';
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
			const { email, password } = req.body.user;

			if (!email || !password) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userRepo.read({
				select: ['id', 'email', 'firstname', 'lastname', 'password'],
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

			return res.json({ status: res.statusCode, data: { token, user } });
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
			const { email, password } = req.body.user;

			if (!email || !req.body.user) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const invitation: UserInvitation | undefined = await this.getUserInvitation(hash, email);

			// Invalid registration hash
			if (!invitation) {
				return res.status(403).json({ status: 403, error: 'Invalid hash' });
			}

			const user: User | undefined = await this.userRepo.read({
				where: {
					email
				}
			});

			// Email is already taken
			if (user) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			const newUser: User = await this.userRepo.save({
				...req.body.user,
				password: await UtilityService.hashPassword(password),
				userRole: {
					id: 1,
					name: 'User'
				}
			});

			// Clear user cache
			this.cacheService.delete('user');

			// Don't send user password in response
			delete newUser.password;

			// Remove user invitation
			await this.userInvRepo.deleteUserInvitation(invitation);

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

			if (!email || !validator.isEmail(email)) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userRepo.read({
				where: {
					email
				}
			});

			// User is already registered
			if (user) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			// UUID for registration link
			const hash = UtilityService.generateUuid();

			await this.userInvRepo.saveUserInvitation({
				email,
				hash
			} as UserInvitation);

			await this.userInvMailService.sendUserInvitation(req.body.email, hash);

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

			if (!email) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userRepo.read({
				where: {
					email
				}
			});

			// User not found
			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
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

			if (!hash) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const invitation = await this.getUserInvitation(hash);
			return invitation ? res.status(204).send() : res.status(403).json({ status: 403, error: 'Invalid hash' });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param hash
	 * @param email
	 * @returns Returns user invitation
	 */
	@bind
	private async getUserInvitation(hash: string, email?: string): Promise<UserInvitation | undefined> {
		try {
			return this.userInvRepo.readUserInvitation(email === undefined ? { hash } : { hash, email });
		} catch (err) {
			throw err;
		}
	}
}
