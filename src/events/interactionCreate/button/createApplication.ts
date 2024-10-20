import {
	ActionRowBuilder,
	type ButtonInteraction,
	type ModalActionRowComponentBuilder as ModalActionRow,
	ModalBuilder,
	type TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';

import { application } from '@/configuration';
import { customId as modalId } from '@/events/interactionCreate/modalSubmit/createApplication';
import type { PermanentButtonInteraction } from '@/types';

export const customId = 'applicationCreateButton';

export class CreateApplicationButton implements PermanentButtonInteraction {
	public customId = customId;
	public async execute(interaction: ButtonInteraction) {
		if (!interaction.channel || !interaction.channel.isTextBased()) return;

		const channel = interaction.channel as TextChannel;

		const thread = (await channel.threads.fetch()).threads.find((thread) =>
			thread.name.endsWith(interaction.user.id)
		);

		// todo: there is a limit of max threads per text channel (1000 i guess?), check if it's reached

		if (thread) {
			if (thread.archived) {
				await thread.setArchived(false);
			}

			const members = await thread.members.fetch();

			if (!members.some((member) => member.id === interaction.user.id)) {
				await thread.members.add(interaction.user);

				interaction.reply({
					content: `Mevcut alt başlığına geri eklendin: ${thread}`,
					ephemeral: true,
				});

				return;
			}

			interaction.reply({
				content: `Mevcut bir alt başlığına sahipsin: ${thread}`,
				ephemeral: true,
			});

			return;
		}

		interaction.showModal(createModal());
	}
}

function createModal() {
	const modal = new ModalBuilder()
		.setCustomId(modalId)
		.setTitle('Başvuru Formu');

	for (const question in application.questions) {
		const input = new TextInputBuilder()
			.setCustomId(`${modalId}F${question}`)
			.setLabel(`Soru ${Number(question) + 1}`)
			.setPlaceholder(application.questions[question])
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		if (application.questions[question].length >= 60) {
			input.setStyle(TextInputStyle.Paragraph);
		}

		const row = new ActionRowBuilder<ModalActionRow>().addComponents(input);

		modal.addComponents(row);
	}

	return modal;
}
