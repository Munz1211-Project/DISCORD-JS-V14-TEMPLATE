const fs = require("fs");

module.exports = (client) => {

    let folders = fs.readdirSync("./commands/");
    
    folders.forEach((dir) => {
        const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                client.logger.log(`> ➕ • Command ${command.name} from ${command.category} category is now loaded.`, "cmd")
            } else {
                client.logger.log(`${file} - ❌  -> missing a help.name, or help.name is not a string.`, "warn");
                continue;
            }
            client.commands.set(command.name, command);
        }
    });
    client.logger.log(`> ✅ • Loaded Successfully [COMMAND]`, "success");
};
