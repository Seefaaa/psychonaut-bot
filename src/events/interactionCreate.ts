import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	CommandInteraction,
	Events,
} from 'discord.js';
import type { Event } from '.';

export default {
	name: Events.InteractionCreate,
	async execute(interaction: CommandInteraction) {
		if (interaction.isChatInputCommand()) {
			await handleChatInputCommand(interaction);
		} else if (interaction.isAutocomplete()) {
			await handleAutocomplete(interaction);
		}
	},
} satisfies Event;

async function handleChatInputCommand(
	interaction: ChatInputCommandInteraction
) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
}

async function handleAutocomplete(interaction: AutocompleteInteraction) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(
			`No autocomplete matching ${interaction.commandName} was found.`
		);
		return;
	}

	try {
		await command.autocomplete?.(interaction);
	} catch (error) {
		console.error(error);
	}
}
