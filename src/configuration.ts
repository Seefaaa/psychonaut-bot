import { existsSync, readFileSync } from 'node:fs';

import { TOML } from 'bun';

import type { Config } from '@/types';

if (!existsSync('config.toml')) {
	throw 'Config: config.toml does not exist on cwd';
}

const snakeCase = TOML.parse(readFileSync('config.toml', 'utf8')) as Config;

const configuration = {
	botToken: snakeCase.bot_token,
	applicationId: snakeCase.application_id,
	guildId: snakeCase.guild_id,
	log: {
		path: snakeCase.log.path,
		colorize: snakeCase.log.colorize,
		verifyChannel: snakeCase.log.verify_channel,
	},
	api: {
		url: snakeCase.api.url,
		token: snakeCase.api.token,
	},
	application: {
		questions: snakeCase.application.questions,
	},
};

// Export for easy use

export const botToken = configuration.botToken;
export const applicationId = configuration.applicationId;
export const guildId = configuration.guildId;
export const log = configuration.log;
export const api = configuration.api;
export const application = configuration.application;
export default configuration;

// Validation

if (
	typeof configuration.botToken !== 'string' ||
	configuration.botToken.length === 0
) {
	throw 'Config: bot_token is required';
}

if (
	typeof configuration.applicationId !== 'string' ||
	configuration.applicationId.length === 0
) {
	throw 'Config: application_id is required';
}

if (
	typeof configuration.guildId !== 'string' ||
	configuration.guildId.length === 0
) {
	throw 'Config: guild_id is required';
}

if (
	typeof configuration.log.path !== 'string' ||
	configuration.log.path.length === 0
) {
	throw 'Config: log.path is required';
}

if (typeof configuration.log.colorize !== 'boolean') {
	throw 'Config: log.colorize is required';
}

if (
	typeof configuration.log.verifyChannel !== 'string' ||
	configuration.log.verifyChannel.length === 0
) {
	throw 'Config: log.verify_channel is required';
}

if (
	typeof configuration.api.url !== 'string' ||
	configuration.api.url.length === 0
) {
	throw 'Config: api.url is required';
}

if (
	typeof configuration.api.token !== 'string' ||
	configuration.api.token.length === 0
) {
	throw 'Config: api.token is required';
}

if (
	!Array.isArray(configuration.application.questions) ||
	configuration.application.questions.length === 0
) {
	throw 'Config: application.questions is required';
}
