const config = require('../config.json');

module.exports = async (client, guild) => {
	client.settings.ensure(guild.id, { prefix: config.prefix });
};