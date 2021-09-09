const discord = require("discord.js");

const client = new discord.Client({
        restTimeOffset: 0,
        restWsBridgetimeout: 100,
        intents: 32767,
        allowedMentions: {
                parse: ["users"],
                repliedUser: true
        },
        cacheWithLimits: {
                MessageManager: {
                        sweepInterval: 300,
                        sweepFilter: discord.LimitedCollection.filterByLifetime({
                                lifetime: 60,
                                getComparisonTimestamp: m => m.editedTimestamp ?? m.createdTimestamp,
                        })
                }
        }
});

const config = require("./config.json");
                          
client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.cooldowns = new discord.Collection();
client.userVoice = new discord.Collection();
                          
["commands", "events"].forEach(handler => {
        require(`./handlers/${handler}`)(client);
});

client.login(config.token).catch(() => { console.log('Invaid TOKEN!') });