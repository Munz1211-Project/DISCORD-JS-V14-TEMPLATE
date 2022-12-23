const config = require('../../config.json');
const axios = require("axios").default;
const util = require("util");

module.exports = {

    name: "eval",
    aliases: ["ev"],
    description: "evaluation you code.",
    category: "Owner",
    cooldown: 3,
    run: async (client, message, args) => {
            
        if (message.author.id !== config.ownerID) return message.channel.send('Can\'t execute this command!');

        const msg = message;
        const bot = client;
        let code = args.join(" ");
        
        try {
                if (!code) return msg.channel.send("What you'r **JavaScript Codes** ?");

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
                if (typeof evaled !== "string") evaled = util.inspect(evaled, { depth: 0 });

                let output = clean(evaled);

                output = output.replace(new RegExp(client.token, "g"), "[TOKEN]");
                output = output.replace(new RegExp(bot.token, "g"), "[TOKEN]");

                if (output.length > 1024) {
                const { data } = await axios.post('https://bin.hzmi.xyz/documents', output)
                    await msg.channel.send({ 
                    content: "Eval...!",
                    components: [{
                        "type": 1,
                        "components": [{
                            "type": 2,
                            "label": "Result",
                            "url": `https://bin.hzmi.xyz/${data.key}.js`,
                            "style": 5
                        }]
                    }]
                })
            } else {
                message.channel.send({ content: `**Output:** \n\`\`\`js\n${output}\n\`\`\`` });
            }
        } catch (e) {
            const error = clean(e);
            message.channel.send({ content: `**ERROR:** \n\`\`\`js\n${error}\n\`\`\``});
        }
    }
}

function clean(text) {
    if (typeof text === "string") return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    // eslint-disable-line prefer-template
    else return text;
}
