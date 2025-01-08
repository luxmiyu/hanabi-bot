// to register discord commands

import {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  REST,
  Routes,
} from 'discord.js'

const botToken = process.env.BOT_TOKEN
const botId = process.env.BOT_ID

export default async function registerCommands() {
  if (botId === undefined) throw new Error('DISCORD_CLIENT_ID is missing!')
  if (botToken === undefined) throw new Error('DISCORD_CLIENT_TOKEN is missing!')

  const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('replies with pong!'),

    new SlashCommandBuilder()
      .setName('prompt')
      .setDescription('prompts a message')
      .addStringOption((option) =>
        option.setName('prompt').setDescription('the prompt').setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('image')
      .setDescription('prompts using OCR')
      .addAttachmentOption((option) =>
        option.setName('image').setDescription('the image containing the text').setRequired(true)
      ),

    new ContextMenuCommandBuilder().setName('Explain Code').setType(ApplicationCommandType.Message),

    new ContextMenuCommandBuilder().setName('Refine Code').setType(ApplicationCommandType.Message),
  ]

  const rest = new REST({ version: '9' }).setToken(botToken)

  try {
    console.log('registering commands...')
    await rest.put(Routes.applicationCommands(botId), {
      body: commands.map((command) => command.toJSON()),
    })
    console.log('succesfully registered commands')
  } catch (error) {
    console.error(error)
  }
}
