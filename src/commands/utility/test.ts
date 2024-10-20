import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	type MessageActionRowComponentBuilder as MessageActionRow,
	SlashCommandBuilder,
} from 'discord.js';

import { customId as buttonId } from '@/events/interactionCreate/button/createApplication';
import type { Command } from '@/types';

export class TestCommand implements Command {
	public builder = new SlashCommandBuilder()
		.setName('test')
		.setDescription('Replies with Pong!');
	public async execute(interaction: ChatInputCommandInteraction) {
		const button = new ButtonBuilder()
			.setCustomId(buttonId)
			.setLabel('Başvuru Oluştur')
			.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder<MessageActionRow>().addComponents(button);

		if (interaction.channel?.isSendable()) {
			await interaction.channel?.send({
				content: 'Permanent interaction buttons!',
				components: [row],
			});

			interaction.reply({
				content: 'Created permanent interaction buttons!',
				ephemeral: true,
			});
		} else {
			interaction.reply({
				content: 'I cannot send messages in this channel!',
				ephemeral: true,
			});
		}
	}
}
