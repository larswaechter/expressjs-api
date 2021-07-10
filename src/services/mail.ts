import { Data, renderFile } from 'ejs';
import { createTransport, SendMailOptions, SentMessageInfo, Transporter, TransportOptions } from 'nodemailer';
import { resolve } from 'path';

import { env } from '../config/globals';
import { logger } from '../config/logger';

/**
 * MailService
 *
 * Service for sending emails
 */
export class MailService {
	private transporter: Transporter = createTransport(env.SMTP as TransportOptions);

	/**
	 * Send email
	 *
	 * @param options Mail options
	 * @param forceSend Force email to be sent
	 * @returns Returns info of sent mail
	 */
	public sendMail(options: SendMailOptions, forceSend: boolean = false): Promise<SentMessageInfo> | void {
		if (env.NODE_ENV === 'production' || forceSend) {
			return this.transporter.sendMail(options);
		}
		logger.info('Emails are only sent in production mode!');
	}

	/**
	 * Render EJS template for Email
	 *
	 * @param templatePath Path of template to render
	 * @param templateData Data for template to render
	 */
	public renderMailTemplate(templatePath: string, templateData: Data): Promise<string> {
		return renderFile(resolve(templatePath), templateData);
	}
}
