import { useCallback, useEffect, useState } from "react"
import type { Client, Room, RoomAvailable } from "colyseus.js"
import { Link, useNavigate } from "react-router-dom"

type Props = {
    client: Client
}

const LobbyPage = ({ client }: Props) => {
    const [rooms, setRooms] = useState<RoomAvailable[]>([])
    const navigate = useNavigate();

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

    const handleJoinRandomRoomAsync = async () => {
        const room = await client.join("testroom");
        localStorage.setItem(room.id, JSON.stringify({ roomId: room.id, sessionId: room.sessionId }));
        room.leave(false);
        navigate(`/${room.id}`);
    }

    const handleCreateRoomAsync = async () => {
        const room = await client.create("testroom");
        localStorage.setItem(room.id, JSON.stringify({ roomId: room.id, sessionId: room.sessionId }));
        room.leave(false);
        navigate(`/${room.id}`);
    }

    return (
        <div>
            <h1>Lobby</h1>

            <input type="button" value="join random" onClick={handleJoinRandomRoomAsync}/>
            <input type="button" value="create" onClick={handleCreateRoomAsync}/>

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