import {
  ActionRowBuilder,
  MessageContextMenuCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import generateResponse from './generateResponse'

async function onMessageContextMenuCommand(interaction: MessageContextMenuCommandInteraction) {
  if (interaction.commandName === 'Explain Code') {
    await interaction.deferReply()

    const response = await generateResponse([
      {
        role: 'system',
        content: 'You are a helpful coding assistant. Explain the following code:',
      },
      { role: 'user', content: interaction.targetMessage.content },
    ])

    await interaction.editReply({
      content: response,
    })
  }

  if (interaction.commandName === 'Refine Code') {
    const modal = new ModalBuilder()
      .setTitle('Refine Code')
      .setCustomId(`refine_${interaction.targetMessage.channelId}_${interaction.targetMessage.id}`)

    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel('Refine Code')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input)

    modal.addComponents(firstActionRow)

    await interaction.showModal(modal)
  }
}

export default onMessageContextMenuCommand
