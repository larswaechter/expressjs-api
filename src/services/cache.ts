import nodeCache from 'node-cache';

import { env } from '../config/globals';

/**
 * TODO: Refactor
 */

export class CacheService {
	private static cache: nodeCache = new nodeCache({ stdTTL: env.CACHE_TTL });

	/**
	 * Get cache value and set if not provided
	 *
	 * @param key Cache key
	 * @param storeFunction Function to execute if key is not set
	 * @param storeFunctionArgs Arguments for store function
	 * @returns Returns cache key value
	 */
	public get(
		key: string,
		storeFunction: Function = () => Promise.resolve(),
		storeFunctionArgs: any[] = []
	): Promise<any> {
		const value = CacheService.cache.get(key);

		if (value) {
			return Promise.resolve(value);
		}

		return storeFunction(...storeFunctionArgs).then((res: any) => {
			CacheService.cache.set(key, res);
			return res;
		});
	}

	public set(key: string | number, data: any) {
		CacheService.cache.set(key, data);
	}

	public delete(keys: string | number) {
		CacheService.cache.del(keys);
	}

	public getStats() {
		return CacheService.cache.getStats();
	}

	public getKeys() {
		return CacheService.cache.keys();
	}

	public flush() {
		CacheService.cache.flushAll();
	}
}
