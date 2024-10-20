import type { ButtonInteraction } from 'discord.js';

import type { PermanentButtonInteraction } from '@/types';

import * as createApplication from './createApplication';

const buttonInteractions = new Map<string, PermanentButtonInteraction>();

for (const ButtonInteraction of Object.values(
	Object.assign({}, createApplication)
)) {
	if (typeof ButtonInteraction === 'function') {
		const buttonInteraction = new ButtonInteraction();
		buttonInteractions.set(buttonInteraction.customId, buttonInteraction);
	}
}

export default async function button(interaction: ButtonInteraction) {
	const buttonInteraction = buttonInteractions.get(interaction.customId);

	if (buttonInteraction) {
		try {
			await buttonInteraction.execute(interaction);
		} catch (error) {
			throw `Permanent button interaction failed: ${error}`;
		}
	}
}
