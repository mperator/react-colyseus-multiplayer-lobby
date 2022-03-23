import { useCallback, useEffect, useState } from "react"
import type { Client, Room, RoomAvailable } from "colyseus.js"
import { Link } from "react-router-dom"

type Props = {
    client: Client
}

const LobbyPage = ({ client }: Props) => {
    const [rooms, setRooms] = useState<RoomAvailable[]>([])

    const handleLobbyRoomsInit = useCallback((r: RoomAvailable[]) => setRooms(r), [rooms]);
    const handleLobbyRoomsAdd = useCallback(([id, room]: any) => {
        setRooms(r => {
            const index = r.findIndex(x => x.roomId === id);
            if(index !== -1) {
                r[index] = room;
                return [...r];
            }
            return [...r, room];
        });
    }, [rooms]);
    const handleLobbyRoomsRemove = useCallback(id => setRooms(r => r.filter(x => x.roomId !== id)), [rooms]);

    useEffect(() => {
        let lobby: Room;
        (async () => {
            lobby = await client.joinOrCreate('lobby');
            lobby.onMessage("rooms", handleLobbyRoomsInit)
            lobby.onMessage("+", handleLobbyRoomsAdd)
            lobby.onMessage("-", handleLobbyRoomsRemove);
        })().catch(e => console.error(e));

      return () => {
            lobby.leave(true);
      }
    }, []);

    const handleJoinOrCreateTestRoomAsync = async () => {
        await client.joinOrCreate("testroom");
    }

    return (
        <div>
            <h1>Lobby</h1>
            <input type="button" value="create and join" onClick={handleJoinOrCreateTestRoomAsync}/>

            <div>
                {rooms.map(r => (
                    <div key={r.roomId}>
                        <span>{r.roomId} {r.clients} {r.maxClients}</span>

                        {r.clients < r.maxClients ? 
                            <Link to={`/${r.roomId}`}>join</Link> :
                            null
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LobbyPage