const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./configs/configbc.json');

const commands = [
  new SlashCommandBuilder().setName('say').setDescription('Say what you will type').addStringOption((option) => option.setName('text')
    .setDescription('This will be said by the bot')
    .setRequired(true)),
  new SlashCommandBuilder().setName('log_profit').setDescription('check total profit from logged trades'),
  new SlashCommandBuilder().setName('log_removelastlog').setDescription('Removes last trade from logs'),
  new SlashCommandBuilder().setName('log_tradedwith').setDescription('Shows people you traded with'),
  new SlashCommandBuilder().setName('log_addsellrate').setDescription('Will add the rate you are selling the coin at to log trades easier').addStringOption((option) => option.setName('coin')
    .setDescription('Coin name')
    .setRequired(true))
    .addNumberOption((option) => option.setName('rate')
      .setDescription('rate')
      .setRequired(true)),
  new SlashCommandBuilder().setName('log_removesellrate').setDescription('Will remove the rate you are selling the coin at').addStringOption((option) => option.setName('coin')
    .setDescription('Coin name')
    .setRequired(true)),
  new SlashCommandBuilder().setName('log_tradeswith').setDescription('check total profit from trading with a person').addStringOption((option) => option.setName('nick')
    .setDescription('nickname')
    .setRequired(true)),
  new SlashCommandBuilder().setName('log_sellrate').setDescription('Will show the rate you are selling the coin at').addStringOption((option) => option.setName('coin')
    .setDescription('Coin name')
    .setRequired(true)),
  new SlashCommandBuilder().setName('log_logtrade').setDescription('will log the trade').addStringOption((option) => option.setName('traded_with')
    .setDescription('nickname')
    .setRequired(true))
    .addStringOption((option) => option.setName('crypto_sent')
      .setDescription('Coin name')
      .setRequired(true))
    .addNumberOption((option) => option.setName('sent')
      .setDescription('amount')
      .setRequired(true))
    .addStringOption((option) => option.setName('crypto_received')
      .setDescription('Coin name')
      .setRequired(true))
    .addNumberOption((option) => option.setName('received')
      .setDescription('amount')
      .setRequired(true))
    .addNumberOption((option) => option.setName('rate_sold_at')
      .setDescription('specify 0 to log using rate from list and not calculating profit if there is no rate on the list.')
      .setRequired(true)),
]
  .map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
