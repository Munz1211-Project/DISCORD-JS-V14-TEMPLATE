const discord = require("discord.js");
const config = require("../config.json");

module.exports = async (client, message) => {

    client.settings.ensure(message.guildId, {
        prefix: config.prefix,
    });
    
    let prefix = client.settings.get(message.guildId, "prefix");

    let teag = new discord.MessageEmbed()
        .setColor(config.color)
        .setDescription(`👋 | Hey **${message.author.tag}**, My prefix for this guild is: \`${prefix}\``)
    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`)
    return message.channel.send({ embeds: [teag] })

    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmda = args.shift().toLowerCase();
    let command = client.commands.get(cmda) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmda));
    if (!command) return;

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new discord.Collection());
    }

    let now = Date.now();
    let timeStamp = client.cooldowns.get(command.name) || new Collection();
    let cool = command.cooldown || 5;
    let userCool = timeStamp.get(message.author.id) || 0;
    let estimated = userCool + cool * 1000 - now;

    if (userCool && estimated > 0) {
        let cool = new discord.MessageEmbed()
            .setDescription(`❌ Please wait ${( estimated / 1000 ).toFixed()}s more before reusing the ${command.name} command.`)
        return (await message.reply({ embeds: [cool] })
            .then(msg => { setTimeout(() => msg.delete().catch(() => null), estimated) })
        )
    }

    timeStamp.set(message.author.id, now);
    client.cooldowns.set(command.name, timeStamp);
    try {
        command.run(client, message, args)
    } catch (error) {
        client.logger.log(error, "error");
        message.reply({ content: `there was an error trying to execute that command!` });
    } finally {
        client.logger.log(`> ID : ${message.author.id} | User : ${message.author.tag} | command | ${command.name}`, "info");
    }
};
