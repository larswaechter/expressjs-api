import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { env, mails } from '../../../../config/globals';

import { MailService } from '../../../../services/mail';

export class UserInvitationMailService extends MailService {
	/**
	 * Send user invitation email
	 *
	 * @param email Email to which the invitation is sent
	 * @param uuid UUID for registration link
	 * @returns Returns info of sent mail
	 */
	public async sendUserInvitation(email: string, uuid: string): Promise<SentMessageInfo> {
		const templateParams = {
			confirmUrl: `${env.DOMAIN}/register/${uuid}?email=${email}`
		};

		const mailTemplate = await this.renderMailTemplate(
			'./dist/api/components/global/user-invitation/templates/user-invitation.html',
			templateParams
		);

		const mail: SendMailOptions = {
			from: mails.support,
			html: mailTemplate,
			subject: 'You were invited to join Aionic',
			to: email
		};

		// Send final mail
		return this.sendMail(mail);
	}
}
