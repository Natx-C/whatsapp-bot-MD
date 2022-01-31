/**
penak turu ra resiko
**/

const { 
    downloadContentFromMessage, 
    generateWAMessageFromContent,
    proto,
} = require("@adiwajshing/baileys-md");

const fs = require('fs')
const skh = require('skh-api')
const { spawn, exec } = require("child_process")
const axios = require("axios")
const chalk = require('chalk')
const ffmpeg = require('fluent-ffmpeg')
const moment = require("moment-timezone");
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('DD/MM/YY HH:mm:ss z')

const { color } = require('./lib/color')
const { fetchJson, getBase64, kyun, createExif } = require('./lib/fetcher')
const { sleep, uploadImages, getBuffer, getGroupAdmins, getRandom } = require('./lib/functions')
const Exif = require('./lib/exif');
const exif = new Exif();

// APIKEYs AND APIs
const setting = JSON.parse(fs.readFileSync('./setting/setting.json'))

// SET
publik = true
apiUrl = setting.apiUrl
apiKey = setting.apiRey
multi = true
nopref = false

module.exports = async(sekha, skh) => {
    try {
        const fromMe = skh.key.fromMe
        const content = JSON.stringify(skh.message)
        const from = skh.key.remoteJid
        const type = Object.keys(skh.message)[0]
        const cmd = (type === 'conversation' && skh.message.conversation) ? skh.message.conversation : (type == 'imageMessage') && skh.message.imageMessage.caption ? skh.message.imageMessage.caption : (type == 'documentMessage') && skh.message.documentMessage.caption ? skh.message.documentMessage.caption : (type == 'videoMessage') && skh.message.videoMessage.caption ? skh.message.videoMessage.caption : (type == 'extendedTextMessage') && skh.message.extendedTextMessage.text ? skh.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && skh.message.buttonsResponseMessage.selectedButtonId) ? skh.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && skh.message.templateButtonReplyMessage.selectedId ? skh.message.templateButtonReplyMessage.selectedId : (type === 'listResponseMessage' && skh.message.listResponseMessage.title) ? skh.message.listResponseMessage.title : ""
		
        if (multi) {
            var prefix = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα¦|/\\©^]/.test(cmd) ? cmd.match(/^[°zZ#$@*+,.?=''():√%¢£¥€π¤ΠΦ_&><!`™©®Δ^βα¦|/\\©^]/gi) : '.'
        } else {
            if (nopref) {
                prefix = ''
            } else {
                prefix = prefa
            }
        }

        const body = (type === 'listResponseMessage' && skh.message.listResponseMessage.title) ? skh.message.listResponseMessage.title : (type === 'buttonsResponseMessage' && skh.message.buttonsResponseMessage.selectedButtonId) ? skh.message.buttonsResponseMessage.selectedButtonId : (type === 'conversation' && skh.message.conversation.startsWith(prefix)) ? skh.message.conversation : (type == 'imageMessage') && skh.message.imageMessage.caption.startsWith(prefix) ? skh.message.imageMessage.caption : (type == 'videoMessage') && skh.message.videoMessage.caption.startsWith(prefix) ? skh.message.videoMessage.caption : (type == 'extendedTextMessage') && skh.message.extendedTextMessage.text.startsWith(prefix) ? skh.message.extendedTextMessage.text : ""
		const budy = (type === 'conversation') ? skh.message.conversation : (type === 'extendedTextMessage') ? skh.message.extendedTextMessage.text : ''

        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const isCmd = body.startsWith(prefix)
        const args = body.trim().split(/ +/).slice(1)
		const arg = budy.slice(command.length + 2, budy.length)
        const ar = args.map((v) => v.toLowerCase())
		const q = args.join(' ')

        const botNumber = sekha.user.id.split(':')[0] + '@s.whatsapp.net'
        const ownerNumber = ["62812XXXX@s.whatsapp.net"]
        const isGroup = from.endsWith('@g.us')
        const sender = isGroup ? (skh.key.participant ? skh.key.participant : skh.participant) : skh.key.remoteJid
        
        const fullname =  skh.pushName || "SKH"
        const pushname = fullname.replace(/ .*/,'');

        const groupMetadata = isGroup ? await sekha.groupMetadata(from) : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const groupOwner = isGroup ? groupMetadata.owner : ''
        const groupDesc = isGroup ? groupMetadata.desc : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''

        const isOwner = ownerNumber.includes(sender)
        const isGroupAdmins = groupAdmins.includes(sender) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        
        const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'stickerMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
        const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

        // FUNCTION
        const reply = (string) => {
            sekha.sendMessage(from, { text: string }, { quoted: skh })
        }

        if (!publik) {
			if (!isOwner && !skh.key.fromMe) return
		}

		if (isCmd && !isGroup) {
			console.log(color('[CMD]', 'cyan'), color(moment(skh.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'orange'), color(prefix + command, 'cyan'), color(pushname, 'orange'), color(sender, 'deeppink'))
		}

		if (!command) {
			console.log(color('[MSG]', 'cyan'), color(moment(skh.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'orange'), color(cmd, 'cyan'), color(pushname, 'orange'), color(sender, 'deeppink'))
		}

        switch (command) {

            // MEDIA FEATURES
            case 'pinterest':
                if(!q) return reply('gambar apa?')
                let pin = await skh.pinterest(q)
                let ha = pin[Math.floor(Math.random() * pin.length)]
                let sil = await getBuffer(ha)
                sekha.sendMessage(from, sil, image, {quoted: skh})
            break
            case 'tiktok':
                if (!q) return await reply(`Example : ${prefix + command} url`)
                get_result = await fetchJson(`${apiUrl}/api/download/tiktok?url=${q}&apikey=${apikey}`)
                get_result = get_result.result.nowatermark
                get_buffer = await getBuffer(get_result)
                sekha.sendMessage(from, { video: get_buffer }, { quoted: skh })
            break
            case 'tiktokaudio':
                if (!q) return await reply(`Example : ${prefix + command} url`)
                get_result = await fetchJson(`${apiUrl}/api/download/tiktok?url=${q}&apikey=${apikey}`)
                get_result = get_result.result.audio
                get_buffer = await getBuffer(get_result)
                sekha.sendMessage(from, { audio: get_buffer }, { quoted: skh })
            break
            case 'twitter':
                if (!q) return await reply(`Example : ${prefix + command} url`)
                get_result = await fetchJson(`${apiUrl}/api/downloader/twitter?url=${q}&apikey=${apikey}`)
                get_result = get_result.result
                txt = `Twitter Downloader\n\n`
                txt += `Desc : ${get_result.desc}`
                get_buffer = await getBuffer(get_result.HD)
                sekha.sendMessage(from, { video: get_buffer, caption: txt }, { quoted: skh })
            break
            case 'facebook': case 'fb':
                if (!q) return await reply(`Example : ${prefix + command} url`)
                get_result = await fetchJson(`${apiUrl}/api/downloader/facebook?url=${q}&apikey=${apikey}`)
                get_result = get_result.result
                txt = `Donasi Su`
                txt += `https://saweria.co/inirey`
                get_buffer = await getBuffer(get_result.url)
                sekha.sendMessage(from, { video: get_buffer, caption: txt }, { quoted: skh })
            break

            // SOON
            
            case 'motivasi': case 'quote': case 'bucinquote': case 'katasenja': case 'puisi': {
                let anu = await fetchJson(`${apiUrl}/api/random/katabijak?apikey=${apikey}`)
                let buttons = [
                    { buttonId: prefix + command, buttonText: {displayText: 'Next'}, type: 1 }
                ]
                let buttonMessage = {
                    text: anu.result,
                    footer: 'Random ' + command,
                    buttons: buttons,
                    headerType: 2
                }
                sekha.sendMessage(from, buttonMessage, { quoted: skh })
            }
            break

            case 'anime': case 'waifu': case 'husbu': case 'neko': case 'shinobu': case 'megumin':
                buffer = await getBuffer(`${apiUrl}/api/wallpaper/${command}?apikey=${apikey}`) 
                sekha.sendMessage(from, { image: buffer, caption: 'cakep ' + command }, { quoted: skh })
            break

        }

    } catch (e) {
		e = String(e)
        console.log(color('[ERR]', 'red'), color(e, 'cyan'))
	}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.cyan(`UPDATE ${__filename}`))
	delete require.cache[file]
	require(file)
})
