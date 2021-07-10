import express from 'express';

import { initRestRoutes } from './routes';

export class Server {
	private readonly _app: express.Application = express();

	public constructor() {
		initRestRoutes(this._app);
	}

	/**
	 * Get Express app
	 *
	 * @returns {express.Application} Returns Express app
	 */
	public get app(): express.Application {
		return this._app;
	}
}
