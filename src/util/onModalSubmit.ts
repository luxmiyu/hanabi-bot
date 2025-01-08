import { ModalSubmitInteraction, TextChannel } from 'discord.js'
import generateResponse from './generateResponse'

async function onModalSubmit(interaction: ModalSubmitInteraction) {
  if (interaction.customId.startsWith('refine_')) {
    await interaction.deferReply()

    const channelId = interaction.customId.split('_')[1]
    const messageId = interaction.customId.split('_')[2]

    const input = interaction.fields.getTextInputValue('input')

    const channel = (await interaction.client.channels.fetch(channelId)) as TextChannel
    if (channel === null) {
      interaction.editReply('Error: Channel not found')
      return
    }

    const message = await channel.messages.fetch(messageId)
    if (message === null) {
      interaction.editReply('Error: Message not found')
      return
    }

    let response = await generateResponse([
      {
        role: 'system',
        content:
          'You are a helpful coding assistant. Refine the following code based on the input. ' +
          'Only output the resulting code. Do not explain.',
      },
      {
        role: 'assistant',
        content: `${message.content}`,
      },
      { role: 'user', content: input },
    ])

    // remove "[blablabla]" from the response if it exists at the start
    if (response.startsWith('[')) {
      const regex = /\[.*\]/
      response = response.replace(regex, '')
    }

    await interaction.editReply(response)
  }
}

export default onModalSubmit
