import { WASocket } from "@whiskeysockets/baileys"
import { WebMessageInfo } from "@whiskeysockets/baileys/src/Types"

interface Message {
    messages: WebMessageInfo[]
}


export default async function Sms(sock: WASocket, m: Message): Promise<void> {
    if (!m) return

    m = m.messages[0]

}