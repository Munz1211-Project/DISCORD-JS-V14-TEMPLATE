const discord = require("discord.js");
const config = require('../../config.json')

module.exports = {

    name: "eval",
    category: "owner",
    aliases: ["e"],
    description: "evaluation you code.",
    cooldown: 3,
    run: async (client, message, args) => {

        if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        if (message.author.id !== config.ownerID) return message.channel.send('Can\'t execute this command!')

        const msg = message;
        const bot = client;
        const evalEmbed = new discord.MessageEmbed().setThumbnail(message.author.displayAvatarURL())
        let code = args.join(" ");

        try {
            const input = clean(code);
            if (!code) return msg.channel.send("What you'r **JavaScript Codes** ?");
            evalEmbed.addField("Input", `\`\`\`js\n${input}\n\`\`\``);
            evalEmbed.setColor(config.color);
            let evaled;
            if (code.includes("--silent") && code.includes("--async")) {
                code = code.replace("--async", "").replace("--silent", "");
                return await eval(`(async () => { ${code} })()`);
            } else if (code.includes("--async")) {
                code = code.replace("--async", "");
                evaled = await eval(`(async () => { ${code} })()`);
            } else if (code.includes("--silent")) {
                code = code.replace("--silent", "");
                return await eval(code);
            } else evaled = await eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled, {
                depth: 0
            });
            let output = clean(evaled);
            output = output.replace(new RegExp(client.token, "g"), "[TOKEN]");
            output = output.replace(new RegExp(bot.token, "g"), "[TOKEN]");
            if (code.includes("--no-embed")) {
                code = code.replace("--no-embed", "");
                return msg.channel.send(`\`\`\`js\n${output}\n\`\`\``);
            }
            evalEmbed.setColor(config.color);
            evalEmbed.addField("Output", `\`\`\`js\n${output}\n\`\`\``);
        } catch (e) {
            const error = clean(e);
            if (code.includes("--no-embed")) {
                code = code.replace("--no-embed", "");
                return msg.channel.send(`\`\`\`js\n${error}\n\`\`\``);
            }
            evalEmbed.setColor("RED");
            evalEmbed.addField("Error", `\`\`\`js\n${error}\n\`\`\``);
        }
        msg.channel.send({
            embeds: [evalEmbed]
        });
    }
};

function clean(text) {
    if (typeof text === "string") return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    // eslint-disable-line prefer-template
    else return text;
}
