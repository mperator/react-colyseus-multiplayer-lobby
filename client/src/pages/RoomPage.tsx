import { Client, Room } from 'colyseus.js';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

type Props = {
    client: Client
}

const RoomPage = ({ client }: Props) => {
    const { roomId } = useParams();

    const [session, setSession] = useState("");

    useEffect(() => {

        

        let room: Room;
        
        (async (roomId: any) => {
            const item = localStorage.getItem(roomId);
    
            if (item) {
                const { roomId, sessionId } = JSON.parse(item);
                room = await client.reconnect(roomId, sessionId);
                localStorage.setItem(roomId, JSON.stringify({ roomId: room.id, sessionId: room.sessionId }));
                setSession(r => room.sessionId);
            } else {
                try
                {
                    room = await client.joinById(roomId)
                    localStorage.setItem(roomId, JSON.stringify({ roomId: room.id, sessionId: room.sessionId }));
                    setSession(r => room.sessionId);
                } catch(e) {
                    console.error(e);
                }
            }
        })(roomId);

        return () => {
            room.leave(false);
        }
    }, []);

    return (
        <div>
            <h1>RoomPage {roomId}</h1>
            <span>{session}</span>
        </div>
    )
}

export default RoomPage