module.exports = (client) => {
  // bot logging and status and activity Presence
client.once('ready', () => {
		console.log(`${client.user.tag} BOT LOGGED IN AND RUNNING NOW!`)
    
		client.user.setPresence({ activity: { name: 'Watching For мΛятιχ HUB Server', type: 'WATCHING' }, status: 'dnd'})
		.catch(console.error)
})
}
