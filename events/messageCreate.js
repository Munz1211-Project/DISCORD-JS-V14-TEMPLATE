const discord = require("discord.js");
const { prefix } = require("../config.json");
module.exports.run = async (client, message) => {

        if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmda = args.shift().toLowerCase();
        let command = client.commands.get(cmda) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmda));
        if (!command) return;

        if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new discord.Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return (await message.reply({
                                        content: `Please wait ${timeLeft.toFixed(1)} second(s) until next command!`
                                })
                                .then(msg => {
                                        setTimeout(() => msg.delete(), 10000)
                                })
                        )
                }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        try {
                command.run(client, message, args)
        } catch (error) {
                console.error(error);
                message.reply({ content: `there was an error trying to execute that command!` });
        } finally {
                console.log(`> ${message.author.username} | used ${command.name} command. Message content: | ${message.content} |`)
        }

}