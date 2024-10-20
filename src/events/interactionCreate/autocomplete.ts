import type { AutocompleteInteraction } from 'discord.js';

import type { Command } from '@/types';
import { get } from '@/utils';

const genericAutocomplete: Record<
	string,
	NonNullable<Command['autocomplete']>
> = { ckey };

export default async function autocomplete(
	interaction: AutocompleteInteraction
) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		throw `No autocomplete matching ${interaction.commandName} was found.`;
	}

	try {
		const focusedValue = interaction.options.getFocused(true);

		if (focusedValue.name in genericAutocomplete) {
			const autocomplete = genericAutocomplete[focusedValue.name];
			await autocomplete(interaction);
			return;
		}

		await command.autocomplete!(interaction);
	} catch (error) {
		try {
			interaction.respond([]);
		} catch {}
		throw error;
	}
}

async function ckey(interaction: AutocompleteInteraction) {
	const focusedValue = interaction.options.getFocused(true);

	const { body } = await get<string[]>(
		`autocomplete/ckey?ckey=${focusedValue.value}`
	);

	interaction.respond(
		body!.map((ckey) => ({
			name: ckey,
			value: ckey,
		}))
	);
}
