import { createClient, RedisClient } from 'redis';

import { env } from '../config/globals';
import { logger } from '../config/logger';

export class RedisService {
	private static client: RedisClient;

	/**
	 * Connect to Redis
	 */
	static connect() {
		this.client = createClient(env.REDIS_URL);
	}

	/**
	 * Disconnect from Redis
	 */
	static disconnect() {
		this.client.end(true);
	}

	/**
	 * Get object as instance of given type
	 *
	 * @param key Cache key
	 * @returns Object
	 */
	static getObject<T>(key: string): Promise<T | null> {
		return new Promise((resolve, reject) => {
			return RedisService.client.get(key, (err, data) => {
				if (err) {
					reject(err);
				}

				if (data === null) resolve(null);

				return resolve(JSON.parse(data) as T);
			});
		});
	}

	/**
	 * Store object
	 *
	 * @param key Cache Key
	 * @param obj Object to store
	 */
	static setObject<T>(key: string, obj: T) {
		RedisService.client.set(key, JSON.stringify(obj), (err) => {
			if (err) logger.error(err);
		});
	}

	/**
	 * Get object as instance of given type and store if not existing in cache
	 *
	 * @param key Cache Key
	 * @param fn Function to fetch data if not existing
	 * @returns Object
	 */
	static getAndSetObject<T>(key: string, fn: () => Promise<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			return RedisService.client.get(key, async (err, data) => {
				if (err) {
					reject(err);
				}

				// Fetch from db and store in cache
				if (data === null) {
					const fetched = await fn();
					this.setObject(key, fetched);
					return resolve(fetched as T);
				}

				return resolve(JSON.parse(data) as T);
			});
		});
	}

	/**
	 * Delete entry by key
	 *
	 * @param key Cache key
	 */
	static deleteByKey(key: string) {
		RedisService.client.del(key);
	}
}
