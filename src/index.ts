import baileys, { makeCacheableSignalKeyStore, Browsers, useMultiFileAuthState, makeInMemoryStore } from "@whiskeysockets/baileys"
import pino, { Logger } from "pino"
import { Socket, Sms } from "./lib"
import { Boom } from "@hapi/boom"

type EventMap = {
    [key: string]: any
}

const logger: any = pino({
    level: "silent"
});

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth/session')

    const store = makeInMemoryStore({logger})

    const socket = await Socket({
        logger: logger,
        printQRInTerminal: true,
        browser: Browsers.ubuntu('Chrome'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        }
    })
    
    store?.bind(socket.ev)

    /* if (!socket.authState.creds.registered) {
        const phone = "51979549311"
        const code = await socket.requestPairingCode(phone)
        console.log("pairing code: " + code)
    } */
    socket.ev.process(async (event: EventMap) => {
        if (event["creds.update"]) {
            await saveCreds()
        }
        if (event["connection.update"]) {
            const update = event["connection.update"]
            const { connection, lastDisconect } = update
            if (connection === "close") {
                // const reason = new Boom(lastDisconect?.error)?.output?.statusCode
                // if (reason) {
                    console.log("reconectando");
                    start()
                // }
            } else if (connection === "open") {
                console.log("bot en linea");
            }
        }
        if (event["message.upsert"]) {
            const update = event["message.upsert"]
            if (update.type === "notify") {
                for(const msg of update.message) {
                    if (!msg.key.fromMe) {
                        await socket.readMessages([msg.key])
                        await socket.sendMessage(msg.key.remoteJid, { text: "hello there"})
                    }
                }
            }
        }

    })
}
start().catch(_ => console.log(_))
