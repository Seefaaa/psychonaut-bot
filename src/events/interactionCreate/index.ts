import {
	ApplicationCommandType,
	ComponentType,
	Events,
	type Interaction,
	InteractionType,
} from 'discord.js';

import logger from '@/logger';
import type { Event } from '@/types';

import autocomplete from './autocomplete';
import button from './button';
import chatInput from './chatInput';
import modal from './modal';

export class InteractionCreateEvent implements Event {
	public name = Events.InteractionCreate;
	public async execute(interaction: Interaction) {
		try {
			switch (interaction.type) {
				case InteractionType.ApplicationCommand:
					switch (interaction.commandType) {
						case ApplicationCommandType.ChatInput:
							await chatInput(interaction as any);
							break;
					}
					break;
				case InteractionType.ApplicationCommandAutocomplete:
					await autocomplete(interaction as any);
					break;
				case InteractionType.MessageComponent:
					switch (interaction.componentType) {
						case ComponentType.Button:
							await button(interaction as any);
							break;
					}
					break;
				case InteractionType.ModalSubmit:
					await modal(interaction as any);
					break;
			}
		} catch (error) {
			logger.error(`There was an error while handling interaction: ${error}`);
		}
	}
}
