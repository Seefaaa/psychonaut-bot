import type { ChatInputCommandInteraction } from 'discord.js';

export default async function chatInputCommand(
	interaction: ChatInputCommandInteraction
) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		throw `No command matching ${interaction.commandName} was found.`;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		try {
			if (interaction.replied || interaction.deferred) {
				interaction.followUp({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			} else {
				interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		} catch {}
		throw error;
	}
}
