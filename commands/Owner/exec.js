const config = require('../../config.json');
const child = require("child_process");
const petitio = require("petitio");

module.exports = {

    name: "exec",
    aliases: ["ex", "$"],
    description: "exec / run terminal in discord!",
    category: "Owner",
    cooldown: 3,
    run: async (client, message, args) => {

        if (message.author.id !== config.ownerID) return message.channel.send('Can\'t execute this command!');

        const command = args.join(" ");
        if (!command) return message.channel.send("please give a command to run in terminal!");

        child.exec(command, async (err, res)  => {

            if (err) return message.channel.send({ content: `**ERROR:** \n\`\`\`js\n${err}\n\`\`\``});

            try{
                if (res.length > 2000) {
                    const { key } = await petitio("https://bin.hzmi.xyz/documents", "POST").body(res).json();
                    await message.channel.send({ 
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
                }).then(msg => {
                    setTimeout(() => msg.delete(), 20000)
                });
            } else {
                message.channel.send(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``, { code: "js" }).then(msg => {
                    setTimeout(() => msg.delete(), 20000)
                });
            }
            } catch (e) {
                message.channel.send({ content: `-`});
            }
        });

    }
}
