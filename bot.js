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
const { token, owner } = require('./config.json');
const fs = require('fs');
const reader = require('xlsx');

try {
	reader.readFile(`./trades.xls`);
} catch {
	const data=[{ traded_with: '', crypto_sent: '', sent: '', crypto_received: '', received: '', rate_sold_at: '', profit: '', total_profit: 0, trades_total: 0 }];
	const workSheet = reader.utils.json_to_sheet(data);
	const workBook = reader.utils.book_new();
	reader.utils.book_append_sheet(workBook, workSheet, "trades");
	reader.writeFile(workBook, `trades.xls`);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
	if (!interaction.isCommand()) return;

	else if (interaction.commandName === 'log_addsellrate') {
		if(interaction.user.id === owner) {
			const embed = addSellRate(interaction.options.getString("coin"), interaction.options.getNumber("rate"));
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
			const embed = removeSellRate(interaction.options.getString("coin"));
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
			const embed = tradelog(interaction.options.getString(`traded_with`), interaction.options.getString(`crypto_sent`), interaction.options.getNumber(`sent`), interaction.options.getString(`crypto_received`), interaction.options.getNumber(`received`), interaction.options.getNumber(`rate_sold_at`));
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
			const embed = tradesWith(interaction.options.getString("nick"));
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
					.setDescription(`You are selling ${interaction.options.getString("coin").toUpperCase()} at ${findRate(interaction.options.getString("coin"))} rate`)
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
			const file = reader.readFile(`./trades.xls`);
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
			interaction.reply({embeds: [removeLastLog()]});
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
			interaction.reply({embeds: [tradedWith()]});
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
	else if (interaction.commandName === 'log_todayprofit') {
		if(interaction.user.id === owner) {
			interaction.reply({embeds: [todayProfit()]});
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

function tradedWith() {
	try {
		const file = reader.readFile(`./trades.xls`);
		var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
		var buf = [], c=1, d='';
		buf[0]=temp[0].tradedWith;
		for(i=1; i<temp.length; i++) {
			for(j=0; j<buf.length; j++) {
				if(temp[i].traded_with===buf[j]) {
					break;
				}
				if(j>=buf.length-1) {
					buf[c]=temp[i].traded_with;
					console.log(temp[i].traded_with, buf[c]);
					c++;
				}
			}
		}
		for(i=1; i<buf.length; i++) {
			if(i<buf.length-1){
				d+=`${buf[i]},  `
			}
			else{
				d+=`${buf[i]}.  `
			}
		}
		const workSheet = reader.utils.json_to_sheet(temp);
		const workBook = reader.utils.book_new();
		reader.utils.book_append_sheet(workBook, workSheet, "trades");
		reader.writeFile(workBook, `trades.xls`);
		return new Discord.MessageEmbed()
			.setTitle(`✅ Command successful`)
			.setDescription(`${d}`)
			.setColor('GREEN')
	} catch {
		return new Discord.MessageEmbed()
				.setTitle(`🚫 Command error`)
				.setDescription(`There was an error while reading the file. The file is deleted or opened by another program.`)
				.setColor('DARK_RED')
	}
}

function removeLastLog() {
	try {
		const file = reader.readFile(`./trades.xls`);
		var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
		temp[0]={ traded_with: '', crypto_sent: '', sent: '', crypto_received: '', received: '', rate_sold_at: '', profit: '', total_profit: Math.round((temp[0].total_profit-temp[temp.length-1].profit)*10000)/10000, trades_total: temp[0].trades_total-1 };
		var buf = [];
		for(i=0; i<temp.length-1; i++) {
			buf[i]=temp[i];
		}
		const workSheet = reader.utils.json_to_sheet(buf);
		const workBook = reader.utils.book_new();
		reader.utils.book_append_sheet(workBook, workSheet, "trades");
		reader.writeFile(workBook, `trades.xls`);
		return new Discord.MessageEmbed()
			.setTitle(`✅ Command successful`)
			.setDescription(`Successfully removed last trade from logs`)
			.setColor('GREEN')
	} catch {
		return new Discord.MessageEmbed()
				.setTitle(`🚫 Command error`)
				.setDescription(`There was an error while reading the file. The file is deleted or opened by another program.`)
				.setColor('DARK_RED')
	}
}

function addSellRate(coin, rate) {
	fs.readFile('rates.json', 'utf8', function readFileCallback(err, data){
		if (err){
			console.log(err);	
			return new Discord.MessageEmbed()
				.setTitle(`🚫 Command error`)
				.setDescription(`There was an error while reading the file. The file is deleted or opened by another program.`)
				.setColor('DARK_RED')
		} else {
		obj = JSON.parse(data);
		if(obj.rates.length===0){
			obj.rates.push(coin.toUpperCase(), rate);
		}
		for(i=0; i<obj.rates.length; i+=2) {
			if(obj.rates[i].toString().toUpperCase()===coin.toString().toUpperCase()) {
				obj.rates[i+1]=rate;
				break;
			}
			if(i>=obj.rates.length-2) {
				obj.rates.push(coin.toUpperCase(), rate);
				break;
			}
		}
		json = JSON.stringify(obj);
		fs.writeFile('rates.json', json, 'utf8', function(err){
			if(err) return console.log(err);
		});
	}});
	return new Discord.MessageEmbed()
		.setTitle(`✅ Command successful`)
		.setDescription(`Now using ${rate.toString().toUpperCase()} rate for ${coin.toUpperCase()} when calculating.`)
		.setColor('GREEN')
}

function removeSellRate(coin) {
	fs.readFile('rates.json', 'utf8', function readFileCallback(err, data){
		if (err){
			console.log(err);	
			return new Discord.MessageEmbed()
				.setTitle(`🚫 Command error`)
				.setDescription(`There was an error while reading the file. The file is deleted or opened by another program.`)
				.setColor('DARK_RED')
		} else {
		obj = JSON.parse(data);
		var rates = [], a=0;
		if(obj.rates[0].toString().toUpperCase()!==coin.toString().toUpperCase()) {
			rates[a]=obj.rates[0];
			a++;
		}
		for(i=1; i<obj.rates.length; i++) {
			if(obj.rates[i].toString().toUpperCase()===coin.toString().toUpperCase() || obj.rates[i-1].toString().toUpperCase()===coin.toString().toUpperCase()) {
				continue;
			}
			else {
				rates[a]=obj.rates[i];
				a++;
			}
		}
		obj.rates=rates;
		json = JSON.stringify(obj);
		fs.writeFile('rates.json', json, 'utf8', function(err){
			if(err) return console.log(err);
		});
	}});
	return new Discord.MessageEmbed()
		.setTitle(`✅ Command successful`)
		.setDescription(`Removed the rate for ${coin.toUpperCase()}`)
		.setColor('GREEN')
}

function findRate(coin) {
	var rates = JSON.parse(fs.readFileSync('./rates.json', 'utf8'));
	for(i=0; i<rates.rates.length; i+=2) {
		if(coin.toString().toUpperCase()===rates.rates[i].toString().toUpperCase()) {
			return parseFloat(rates.rates[i+1]);
		}
	}
	return 0;
}

function tradelog(traded_with, crypto_sent, sent, crypto_received, received, rate_sold_at) {
	try {
		const file = reader.readFile(`./trades.xls`);
		var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
		if(rate_sold_at===0) {
			rate_sold_at = findRate(crypto_received);
		}
		temp[0]={ traded_with: '', crypto_sent: '', sent: '', crypto_received: '', received: '', rate_sold_at: '', profit: '', total_profit: Math.round((temp[0].total_profit+(sent-received*rate_sold_at)*-1)*10000)/10000, trades_total: temp[0].trades_total+1 };
		temp[temp.length]={ traded_with: traded_with, crypto_sent: crypto_sent, sent: sent, crypto_received: crypto_received, received: received, rate_sold_at: rate_sold_at, profit: Math.round(((sent-received*rate_sold_at)*-1)*10000)/10000, total_profit: '', trades_total: '' }
		const workSheet = reader.utils.json_to_sheet(temp);
		const workBook = reader.utils.book_new();
		reader.utils.book_append_sheet(workBook, workSheet, "trades");
		reader.writeFile(workBook, `trades.xls`);
		return new Discord.MessageEmbed()
			.setTitle(`✅ Command successful`)
			.setDescription(`Successfully logged the trade with the profit of ${Math.round(((sent-received*rate_sold_at)*-1)*10000)/10000}$`)
			.setColor('GREEN')
	} catch {
		return new Discord.MessageEmbed()
				.setTitle(`🚫 Command error`)
				.setDescription(`There was an error while reading the file. The file is deleted or opened by another program.`)
				.setColor('DARK_RED')
	}
}

function tradesWith(traded_with) {
	try {
		var a, b=0, c=0, d=0;
		const file = reader.readFile(`./trades.xls`);
		var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
		for(i=0; i<temp.length; i++) {
			if(temp[i].traded_with===traded_with) {
				b=b+parseFloat(temp[i].sent)+parseFloat(temp[i].received);
				c=c+parseFloat(temp[i].profit);
				d++;
			}
		}
		a=`User traded with: ${traded_with}\nTrading volume: ${Math.floor(b*10000)/10000}$\nTotal profit from trades: ${Math.floor(c*10000)/10000}$\nTotal trades: ${d}`;
		const workSheet = reader.utils.json_to_sheet(temp);
		const workBook = reader.utils.book_new();
		reader.utils.book_append_sheet(workBook, workSheet, "trades");
		reader.writeFile(workBook, `trades.xls`);
		return new Discord.MessageEmbed()
				.setTitle(`✅ Command successful`)
				.setDescription(a)
				.setColor('GREEN');
	} catch {
		return new Discord.MessageEmbed()
				.setTitle(`🚫 Command error`)
				.setDescription(`There was an error while reading the file. The file is deleted or opened by another program.`)
				.setColor('DARK_RED')
	}
}

client.login(token);
