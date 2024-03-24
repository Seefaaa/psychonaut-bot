import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '..';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
} satisfies Command;