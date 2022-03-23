import { Client, Room } from 'colyseus'

export default class TestRoom extends Room {

    async onCreate() {
        // limit room to 2 clients
        this.maxClients = 2;
    };

    async onJoin(client: Client) { }

    async onLeave(client: Client, consented?: boolean) {
        if (consented) return;

        await this.allowReconnection(client);
    }

    async onDispose() { }
}
