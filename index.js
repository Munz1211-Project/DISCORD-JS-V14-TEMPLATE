const discord = require("discord.js");
const config = require("./config.json");
const Enmap = require("enmap");
require('./server.js');

const client = new discord.Client({
    closeTimeout: 3_000 ,
    waitGuildTimeout: 15_000,
    intents: [discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.GuildMembers, discord.GatewayIntentBits.MessageContent],
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    },
    makeCache: discord.Options.cacheWithLimits({
	...discord.Options.DefaultMakeCacheSettings,
	ReactionManager: 0,
        GuildMemberManager: {
			maxSize: 200,
			keepOverLimit: member => member.id === client.user.id,
		}
	}),
});

client.settings = new Enmap({
	name: "settings",
	fetchAll: false,
	autoFetch: true,
	cloneLevel: "deep"
});

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.cooldowns = new discord.Collection();
client.logger = require('./Utils/logger');

["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('error', error => client.logger.log(error, "error"));
client.on('warn', info => client.logger.log(info, "warn"));
process.on('unhandledRejection', error => client.logger.log("UNHANDLED_REJECTION\n" + error, "error"));
process.on('uncaughtException', error => {
    client.logger.log("UNCAUGHT_EXCEPTION\n" + error, "error");
    client.logger.log("Uncaught Exception is detected, restarting...", "info");
    process.exit(1);
});

client.login(config.token).catch(() => { client.logger.log('Invaid TOKEN!', "warn") });
