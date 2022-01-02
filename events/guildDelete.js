
module.exports = async (client, guild) => {
	client.settings.delete(guild.id);
};