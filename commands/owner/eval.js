const discord = require('discord.js');
const { codeBlock } = require("@discordjs/builders");
const config = require('../../config.json');
const petitio = require("petitio");
const util = require("util");

module.exports = {

    name: "eval",
    aliases: ["ev"],
    description: "evaluation you code.",
    cooldown: 3,
    run: async (client, message, args) => {

        if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        if (message.author.id !== config.ownerID) return message.channel.send('Can\'t execute this command!')

        const msg = message;
        const bot = client;

        try {
            const code = args.join(" ");
            if (!code) return msg.channel.send("What you'r **JavaScript Codes** ?");

            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = util.inspect(evaled, { depth: 0 });
            evaled = evaled.replace(new RegExp(client.token, "g"), "[Censored]");
            evaled = evaled.replace(new RegExp(bot.token, "g"), "[Censored]");

            let output = clean(evaled);

            if (output.length > 1024) {
                const { key } = await petitio("https://bin.hzmi.xyz/documents", "POST").body(output).json();
                await msg.channel.send({ 
                content: "Eval...!",
                components: [{
                    "type": 1,
                    "components": [{
                        "type": 2,
                        "label": "Result",
                        "url": `https://bin.hzmi.xyz/${key}.js`,
                        "style": 5
                    }]
                }]
            })
        } else {
            await msg.channel.send({
                content: codeBlock("js", evaled)
            });
        }
          } catch (e) {
            const embed = new discord.MessageEmbed()
                .setDescription(`${e}`)
                .setColor(config.color)
            message.channel.send({ embeds: [embed] })
        }
    }
}

function clean(text) {
    if (typeof text === "string") return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    // eslint-disable-line prefer-template
    else return text;
}