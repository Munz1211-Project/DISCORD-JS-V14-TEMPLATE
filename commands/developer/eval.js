const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "eval",
    category: "developer",
    aliases: [],
    description: "-",
    cooldown: 5,
    run: async (client, message, args) => {

        try {
            var code = args.join(" ");
            var evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(`Out:\n\`\`\`${evaled}\`\`\``)
        } catch (err) {

            message.channel.send(`Err:\n\`\`\`${clean(err)}\`\`\``)
        }

        function clean(text) {
            if (typeof (text) === 'string')
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            else
                return text;
        }
    },
};