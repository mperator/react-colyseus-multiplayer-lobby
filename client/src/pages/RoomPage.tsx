import { Client } from 'colyseus.js';
import { useParams } from 'react-router-dom'

type Props = {
    client: Client
}

const RoomPage = (props: Props) => {
    const { roomId } = useParams();

    return (
        <div>RoomPage {roomId}</div>
    )
}

export default RoomPage