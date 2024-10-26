import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	type MessageActionRowComponentBuilder as MessageActionRow,
	type ModalSubmitInteraction,
	type TextChannel,
	ThreadAutoArchiveDuration,
} from 'discord.js';

import { submission } from '@/configuration';
import { customId as approveButtonId } from '@/events/interactionCreate/button/approveSubmission';
import { customId as denyButtonId } from '@/events/interactionCreate/button/denySubmission';
import logger from '@/logger';
import type { ModalInteraction } from '@/types';

export const customId = 'createSubmissionModal';

export class CreateSubmissionModal implements ModalInteraction {
	public customId = customId;
	public async execute(interaction: ModalSubmitInteraction) {
		if (!interaction.channel || !interaction.channel.isTextBased()) return;

		const channel = interaction.channel as TextChannel;

		const thread = await channel.threads.create({
			name: `${interaction.user.username} #${interaction.user.id}`,
			autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
			type: ChannelType.PrivateThread,
			invitable: false,
		});

		const answers = submission.questions.map((_, i) =>
			interaction.fields.getTextInputValue(`${customId}F${i}`)
		);

		const row = new ActionRowBuilder<MessageActionRow>().addComponents(
			new ButtonBuilder()
				.setCustomId(approveButtonId)
				.setLabel('Onayla')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId(denyButtonId)
				.setLabel('Reddet')
				.setStyle(ButtonStyle.Danger)
		);

		await thread.send({
			content: `**Başvuru: ${interaction.user}**\n\n${answers.map((a, i) => `${i + 1}) ${submission.questions[i]}\n${a}`).join('\n\n')}\n­`,
			components: [row],
			allowedMentions: { parse: [] },
		});

		await thread.members.add(interaction.user);

		await interaction.reply({
			content: `Başvurun için alt başlık oluşturuldu: ${thread}`,
			ephemeral: true,
		});

		logger.channel(
			'submission',
			interaction.client,
			`${interaction.user} başvuru oluşturdu.`
		);
	}
}
