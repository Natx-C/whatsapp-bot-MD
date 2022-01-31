const {
	default: makeWASocket,
	DisconnectReason,
	useSingleFileAuthState
} = require('@adiwajshing/baileys-md');

const { state, saveState } = useSingleFileAuthState('./sesi.json');
const { color, mylogs } = require('./lib/color');
const pino = require('pino');
const fs = require('fs');
const chalk = require('chalk');

async function start() {
	const sekha = makeWASocket({
		printQRInTerminal: true,
		logger: pino({ level: 'silent' }),
		browser: ['weabotMD', 'Safari', '3.0'],
		auth: state
	})
    console.log(color('Connected....'))
	sekha.ev.on('messages.upsert', async m => {
		if (!m.messages) return
        const skh = m.messages[0]
		require('./skh')(sekha, skh)
	})

	sekha.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			console.log('Connection closed, Try to restart...')
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log(mylogs('connection logged out...'))
		}
	})

	sekha.ev.on('creds.update', () => saveState)
	//
	//
	return sekha
}

start()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.cyan(`UPDATE ${__filename}`))
	delete require.cache[file]
	require(file)
})
