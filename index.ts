import baileys, { makeCacheableSignalKeyStore, Browsers, useMultiFileAuthState } from "@whiskeysockets/baileys"
import * as pino from "pino"
import { Socket, sms } from "./lib"

type EventMap = {
    [key: string]: any
}

async function start(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState('./auth/session')
    
    const socket = Socket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        }
    })

    socket.ev.process(async (event: EventMap) => {

    })
}
start().catch(_ => console.log(_))

