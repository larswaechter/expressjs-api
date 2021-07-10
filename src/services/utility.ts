import { compare, genSalt, hash } from 'bcryptjs';
import { v1 as uuidv1 } from 'uuid';

import * as crypto from 'crypto';

import { logger } from '../config/logger';

/**
 * UtilityService
 *
 * Service for utility functions
 */
export class UtilityService {
	/**
	 * Error handler
	 *
	 * @param err
	 * @returns
	 */
	public static handleError(err: any): void {
		logger.error(err.stack || err);
	}

	/**
	 * Hash plain password
	 *
	 * @param plainPassword Password to hash
	 * @returns Returns hashed password
	 */
	public static hashPassword(plainPassword: string): Promise<string> {
		return new Promise((resolve, reject) => {
			genSalt((err, salt) => {
				if (err) {
					reject(err);
				}

				hash(plainPassword, salt, (error, hashedVal) => {
					if (error) {
						reject(error);
					}

					resolve(hashedVal);
				});
			});
		});
	}

	/**
	 * Compares plain password with hashed password
	 *
	 * @param plainPassword Plain password to compare
	 * @param hashedPassword Hashed password to compare
	 * @returns Returns if passwords match
	 */
	public static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			compare(plainPassword, hashedPassword, (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	}

	/**
	 * Hash string with sha256 algorithm
	 *
	 * @param text String to hash
	 * @returns Returns hashed string
	 */
	public static hashString(text: string): string {
		return crypto.createHash('sha256').update(text).digest('hex');
	}

	/**
	 * Generate UUID
	 *
	 * @returns Returns UUID
	 */
	public static generateUuid(): string {
		return uuidv1();
	}
}
