const Discord = require("discord.js");  
const {
    Client,
    Intents
} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
	partials: ['CHANNEL'],
	ws: { properties: { $browser: "Discord iOS" }}
});
const { token, owner } = require('./configs/config.json');
const fs = require('fs');
const reader = require('xlsx');
const functions = require(`./functions/functions.js`);

try {
	reader.readFile(`./tradelog/trades.xls`);
} catch {
	const data=[{ traded_with: '', crypto_sent: '', sent: '', crypto_received: '', received: '', rate_sold_at: '', profit: '', total_profit: 0, trades_total: 0 }];
	const workSheet = reader.utils.json_to_sheet(data);
	const workBook = reader.utils.book_new();
	reader.utils.book_append_sheet(workBook, workSheet, "trades");
	reader.writeFile(workBook, `./tradelog/trades.xls`);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	var config = JSON.parse(fs.readFileSync('./configs/config.json', 'utf8'));
	if (!interaction.isCommand()) return;

	else if (interaction.commandName === 'log_addsellrate') {
		if(interaction.user.id === owner) {
			const embed = functions.addSellRate(interaction.options.getString("coin"), interaction.options.getNumber("rate"));
			await interaction.reply({ embeds: [embed] });
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_removesellrate') {
		if(interaction.user.id === owner) {
			const embed = functions.removeSellRate(interaction.options.getString("coin"));
			await interaction.reply({ embeds: [embed] });
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_logtrade') {
		if(interaction.user.id === owner) {
			const embed = functions.tradelog(interaction.options.getString(`traded_with`), interaction.options.getString(`crypto_sent`), interaction.options.getNumber(`sent`), interaction.options.getString(`crypto_received`), interaction.options.getNumber(`received`), interaction.options.getNumber(`rate_sold_at`));
			await interaction.reply({ embeds: [embed] });
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_tradeswith') {
		if(interaction.user.id === owner) {
			const embed = functions.tradesWith(interaction.options.getString("nick"));
			await interaction.reply({ embeds: [embed] });
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_sellrate') {
		if(interaction.user.id === owner) {
			interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`✅ Command successful`)
					.setDescription(`You are selling ${interaction.options.getString("coin").toUpperCase()} at ${functions.findRate(interaction.options.getString("coin"))} rate`)
					.setColor('GREEN')
			]});
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_profit') {
		if(interaction.user.id === owner) {
			const file = reader.readFile(`./tradelog/trades.xls`);
			var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
			interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`✅ Command successful`)
					.setDescription(`You have ${temp[0].total_profit}$ profit\nIn ${temp[0].trades_total} trades`)
					.setColor('GREEN')
			]});
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_removelastlog') {
		if(interaction.user.id === owner) {
			interaction.reply({embeds: [functions.removeLastLog()]});
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
	else if (interaction.commandName === 'log_tradedwith') {
		if(interaction.user.id === owner) {
			interaction.reply({embeds: [functions.tradedWith()]});
		}
		else{
			await interaction.reply({embeds: [
				new Discord.MessageEmbed()
					.setTitle(`🚫 Command error`)
					.setDescription(`<@${interaction.user.id}> Only <@${config.owner}> can use trading log and commands associated with it.`)
					.setColor('DARK_RED')
			]});
		}
	}
});

client.login(token);