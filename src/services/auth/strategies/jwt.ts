import { bind } from 'decko';
import { Handler, NextFunction, Request, Response } from 'express';
import { authenticate } from 'passport';
import { Strategy, StrategyOptions } from 'passport-jwt';

import { User } from '../../../api/components/user/model';

import { BaseStrategy } from './base';

/**
 * Passport JWT Authentication
 *
 * - The client signs in via /signin endpoint
 * - If the signin is successfull a JWT is returned
 * - This JWT is used inside the request header for later requests
 */
export class JwtStrategy extends BaseStrategy {
	private strategyOptions: StrategyOptions;

	public constructor(strategyOptions: StrategyOptions) {
		super();
		this.strategyOptions = strategyOptions;
		this._strategy = new Strategy(this.strategyOptions, this.verify);
	}

	/**
	 * Middleware for checking if a user is authorized to access the endpoint
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns if user is authorized
	 */
	public isAuthorized(req: Request, res: Response, next: NextFunction): Handler | void {
		try {
			authenticate('jwt', { session: false }, (err, user: User, info) => {
				// internal error
				if (err) {
					return next(err);
				}
				if (info) {
					switch (info.message) {
						case 'No auth token':
							return res.status(401).json({
								error: 'No jwt provided!'
							});

						case 'jwt expired':
							return res.status(401).json({
								error: 'Jwt expired!'
							});
					}
				}

				if (!user) {
					return res.status(401).json({
						error: 'User is not authorized!'
					});
				}

				// success - store user in req scope
				req.user = user;

				return next();
			})(req, res, next);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Verify incoming payloads from request -> validation in isAuthorized()
	 *
	 * @param payload JWT payload
	 * @param next Express next
	 * @returns
	 */
	@bind
	private async verify(payload: any, next: any): Promise<void> {
		try {
			// pass error == null on error otherwise we get a 500 error instead of 401

			const user = await this.userRepo.findOne({
				relations: ['userRole'],
				where: {
					active: true,
					id: payload.userID
				}
			});

			if (!user) {
				return next(null, null);
			}

			await this.setPermissions(user);

			return next(null, user);
		} catch (err) {
			return next(err);
		}
	}
}
