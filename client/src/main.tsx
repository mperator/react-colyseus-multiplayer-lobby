import { Client } from 'colyseus.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LobbyPage from './pages/LobbyPage'
import RoomPage from './pages/RoomPage'

const client = new Client("ws://localhost:2567");

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LobbyPage client={client} />} />
                <Route path='/:roomId' element={<RoomPage client={client} />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
