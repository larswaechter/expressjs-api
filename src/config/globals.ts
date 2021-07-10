// Environment variables imported from .env file
export const env = {
	CACHE_TTL: 3600,
	NODE_ENV: process.env.NODE_ENV || 'development',
	NODE_PORT: process.env.NODE_PORT || process.env.PORT || 3000,
	DOMAIN: process.env.DOMAIN,
	SMTP: {
		auth: {
			pass: process.env.SMTP_PASSWORD || '',
			user: process.env.SMTP_USERNAME || ''
		},
		host: process.env.SMTP_HOST || '',
		port: process.env.SMTP_PORT || '',
		tls: {
			rejectUnauthorized: false
		}
	}
};

export const mails = {
	support: 'support@dummy-company-com'
};
