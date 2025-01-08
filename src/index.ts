import { Client, IntentsBitField, Events } from 'discord.js'
import 'dotenv/config'

import registerCommands from './register'
import onSlashCommand from './util/onSlashCommand'
import onMessageContextMenuCommand from './util/onMessageContextMenuCommand'
import onModalSubmit from './util/onModalSubmit'

const REGISTER = false

if (REGISTER) {
  registerCommands()
} else {
  const botToken = process.env.BOT_TOKEN
  if (botToken === undefined) throw new Error('DISCORD_CLIENT_TOKEN is missing!')

  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  })

  client.on(Events.ClientReady, (client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`)
  })

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      await onSlashCommand(interaction)
    }

    if (interaction.isMessageContextMenuCommand()) {
      await onMessageContextMenuCommand(interaction)
    }

    if (interaction.isModalSubmit()) {
      await onModalSubmit(interaction)
    }
  })

  client.login(botToken)
}
