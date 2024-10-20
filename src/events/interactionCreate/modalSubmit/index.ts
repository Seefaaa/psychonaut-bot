import type { ModalSubmitInteraction } from 'discord.js';

import type { ModalInteraction } from '@/types';

import * as createApplication from './createApplication';

const modalSubmitInteractions = new Map<string, ModalInteraction>();

for (const ModalInteraction of Object.values(
	Object.assign({}, createApplication)
)) {
	if (typeof ModalInteraction === 'function') {
		const modalInteraction = new ModalInteraction();
		modalSubmitInteractions.set(modalInteraction.customId, modalInteraction);
	}
}

export default async function modalSubmit(interaction: ModalSubmitInteraction) {
	const modalInteraction = modalSubmitInteractions.get(interaction.customId);

	if (modalInteraction) {
		try {
			await modalInteraction.execute(interaction);
		} catch (error) {
			throw `Modal submit interaction failed: ${error}`;
		}
	}
}
