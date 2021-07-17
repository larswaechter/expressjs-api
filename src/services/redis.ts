import { createClient, RedisClient } from 'redis';

import { env } from '../config/globals';

export class RedisService {
	private static client: RedisClient;

	static connect() {
		this.client = createClient(env.REDIS_URL);
	}

	static disconnect() {
		this.client.end(true);
	}

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

	static setObject<T>(key: string, obj: T) {
		RedisService.client.set(key, JSON.stringify(obj));
	}

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

	static deleteKey(key: string) {
		RedisService.client.del(key);
	}
}
