import {
	ChannelType,
	type ModalSubmitInteraction,
	type TextChannel,
	ThreadAutoArchiveDuration,
} from 'discord.js';

import { application } from '@/configuration';
import type { ModalInteraction } from '@/types';

export const customId = 'createApplicationModal';

export class CreateApplicationModal implements ModalInteraction {
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

		const answers = application.questions.map((_, i) =>
			interaction.fields.getTextInputValue(`${customId}F${i}`)
		);

		await thread.send({
			content: `**Başvuru: ${interaction.user}**\n\n${answers.map((a, i) => `${i + 1}) ${application.questions[i]}\n${a}`).join('\n\n')}`,
			allowedMentions: { parse: [] },
		});

		// todo: approve deny buttons & rename some variables to make more sense

		await thread.members.add(interaction.user);

		interaction.reply({
			content: `Başvurun için alt başlık oluşturuldu: ${thread}`,
			ephemeral: true,
		});
	}
}
