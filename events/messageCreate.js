const discord = require("discord.js");
const chalk = require("chalk");
const config = require("../config.json");

module.exports = async(client, message) => {
  
        if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.type === 'dm') return;
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const cmda = args.shift().toLowerCase();
        let command = client.commands.get(cmda) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmda));
        if (!command) return;
  
        if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new discord.Collection());
        }
  
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown) * 1000;
        if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                        const timeLeft = Math.floor((expirationTime - now) % 6);
                        let cool = new discord.MessageEmbed()
                                .setDescription(`❌ Please wait ${timeLeft} more Second(s) before reusing the ${command.name} command.`)
                        return (await message.reply({ 
                          embeds: [cool] 
                        }).then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                      })
                    )
                }
        }
        timestamps.set(message.author.id, now);
        try {
                command.run(client, message, args)
        } catch (error) {
                console.error(chalk.bgBlack.redBright(error));
                message.reply({ content: `there was an error trying to execute that command!` });
        } finally {
                console.log(chalk.bgBlack.whiteBright(`> User ${message.author.username} | used | ${command.name} | command. Message content: | ${message.content} |`));
        }
  
};