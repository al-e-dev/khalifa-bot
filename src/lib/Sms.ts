export default async function Sms(socket: any, m: any): Promise<void> {
    if (!m) return

    m = m.messages[0]

}