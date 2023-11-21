import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Box, CssBaseline, Grid, ThemeProvider} from "@mui/material";
import {theme} from "./assets/themes";
import CallPreview, {CallEntry} from "./CallPreview";
import {getNewMessage, WebRtcChannel} from "./webrtc/WebRtcChannel";


type SocketMessage = {
    message: string
    type: string
    calleeId: string
    sdpOffer: string
    email: string
    name: string
    branch: string
    screen: string
    service: string
    claimId: string
    claimType: string
    claimPhase: string
    room: string
}

function App() {
    const [callList, setCallList] = useState<CallEntry[]>([]);
    let remoteRTCMessage = useRef<string | null>(null);

    const socket = new WebSocket('ws://10.0.0.242:8080/socket')

    console.log("connected to websocket")
    const webRtcChannel: WebRtcChannel = new WebRtcChannel(socket)

    var done = false;

    function delay(ms: number): Promise<typeof setTimeout> {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async function sendMessage(message: string) {
        webRtcChannel.sendSocketMessage({event:"chat", from:"2", to:"1", message:message})
    }

    async function checkNewMessage() {
        for(var i = 0; i<3000 && !done; i++) {
            await delay(1000);
            var newMessage:string | null = getNewMessage();
            if(newMessage != null) {
                console.log("setting message to " + newMessage)
                // sendMessage("Reply to chat!!")
            }
        }
        console.log("done")
    };


    useEffect(() => {
        // eslint-disable-next-line
        checkNewMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    socket.addEventListener('message', (ev) => {
        const data: SocketMessage = JSON.parse(ev.data)
        if (data.message === "makeCall") {
            console.log('got make call!!!')
            console.log(data)
            console.log(ev.data)
            setCallList([{
                id: "1",
                email: data.email,
                fullName: data.name,
                branch: data.branch,
                screen: data.screen,
                service: data.service,
                claimId: data.claimId,
                claimType: data.claimType,
                claimPhase: data.claimPhase
            }, ...callList])
        }
    })

    const setAcceptedCall = (callerId: number) => {
        remoteRTCMessage.current = "Hi";
        socket.send(JSON.stringify({
            "message": "callAccepted",
            "callee": "100",
            "caller": callerId,
            "rtcMessage": "I accepted your call",
        }))
    }

    socket.addEventListener("open", () => {
        console.log("Waiting for a call!!!!");
    })

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Box sx={{paddingLeft: "30px"}}>
                    <Grid container
                          direction="row"
                          display="flex"
                          alignItems="center"
                          sx={{minHeight: '100vh', minWidth: '100%'}}
                          spacing={2}>
                        <CallPreview callEntries={callList} setAcceptedCall={setAcceptedCall} channel={webRtcChannel}/>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;
