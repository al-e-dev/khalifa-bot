import { makeWASocket, WASocket } from "@whiskeysockets/baileys";

export default function Socket(options: Record<string, any> = {}): Promise<WASocket> {
    const sock = Object.defineProperties(makeWASocket(options), {
        parseMention: {
            value(text: string): string[] {
                return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + "@s.whatsapp.net");
            },
        },
    });

    return sock;
}