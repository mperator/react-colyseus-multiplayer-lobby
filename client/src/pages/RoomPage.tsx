import { useParams } from 'react-router-dom'

type Props = {}

const RoomPage = (props: Props) => {
    const { roomId } = useParams();

    return (
        <div>RoomPage {roomId}</div>
    )
}

export default RoomPage