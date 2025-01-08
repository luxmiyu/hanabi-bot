import { ChatInputCommandInteraction } from 'discord.js'
import generateResponse from './generateResponse'
import { createWorker } from 'tesseract.js'

async function onSlashCommand(interaction: ChatInputCommandInteraction) {
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
    return
  }

  if (interaction.commandName === 'prompt') {
    await interaction.deferReply()

    const prompt = interaction.options.getString('prompt')
    if (prompt === null) {
      await interaction.reply({
        content: 'Error: Prompt is null',
        ephemeral: true,
      })
      return
    }

    try {
      const response = await generateResponse([
        {
          role: 'system',
          content:
            'You are a helpful coding assistant. ' +
            'If asked to write code, write it in python, start and end with ```. Do not explain.',
        },
        { role: 'user', content: prompt },
      ])

      await interaction.editReply({
        content: response,
      })
    } catch (error) {
      console.error(error)
      await interaction.editReply({
        content: 'Error: Something went wrong while generating the response',
      })
    }

    return
  }

  if (interaction.commandName === 'image') {
    await interaction.deferReply()

    const attachment = interaction.options.getAttachment('image')
    if (attachment === null) {
      await interaction.reply({
        content: 'Error: Attachment is null',
        ephemeral: true,
      })
      return
    }

    try {
      const worker = await createWorker('eng')
      const prompt = await worker.recognize(attachment.url)
      await worker.terminate()

      const response = await generateResponse([
        {
          role: 'system',
          content:
            'You are a helpful coding assistant. ' +
            'If asked to write code, write it in python, start and end with ```. Do not explain.',
        },
        { role: 'user', content: prompt.data.text },
      ])

      await interaction.editReply({
        content: response,
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default onSlashCommand
