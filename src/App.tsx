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
    currentScreen: string
    service: string
    claimId: string
    claimType: string
    claimPhase: string
    room: string
}

type OfferMessage = {
    message: string,
    calleeId: string,
    rtcMessage: RTCSessionDescriptionInit,
}

function App() {
    let sourceCallerId = "1"
    let destCallerId = "5";
    const [callList, setCallList] = useState<CallEntry[]>([]);
    let remoteRTCMessage = useRef<string | null>(null);

    const iceConfiguration: RTCConfiguration =
        {
            iceServers: [
                {
                    urls: 'turn:jim.vmware.com:3478',
                    username: 'ejim',
                    credential: 'TannerAndTobey100!'
                }
            ]
        }

    let peerConnection = new RTCPeerConnection(iceConfiguration)

    const room = "88"
    sourceCallerId = "1"
    destCallerId = "2"
    const sdpOffer = "3"
    const socket = new WebSocket('ws://10.0.0.242:8080/socket')
    //const socket = new WebSocket('ws://192.168.64.223:8080/socket')

    console.log("connected to websocket")
    console.log(socket)
    const webRtcChannel: WebRtcChannel = new WebRtcChannel(socket)

    var done = false;

    function delay(ms: number): Promise<typeof setTimeout> {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async function sendMessage(message: string) {
        //webRtcChannel.sendDataChannelMessage(message);
        webRtcChannel.sendSocketMessage({event:"chat", from:"2", to:"1", message:message})

    }

    async function checkNewMessage() {
        for(var i = 0; i<3000 && !done; i++) {
            // Do something before delay
            // console.log('before delay');

            await delay(1000);
            var newMessage:string | null = getNewMessage();
            if(newMessage != null) {
                console.log("setting message to " + newMessage);
                sendMessage("Reply to chat!!")
            }

            // Do something after
            // console.log('after delay')
        }
        console.log("done")
    };


    useEffect(() => {
        // load data
        // events.push(getEvent('Event 0', 20220103, getRandomInt(1000)));
        var thread = checkNewMessage();

        // Cleanup Actions
        // return () => {
        //     console.log("Cleaning up");
        //     done = true;
        // }
    }, []);


    // socket.addEventListener('message', (ev) => {
    //     const data: SocketMessage = JSON.parse(ev.data)
    //     if (data.message === "ICEcandidate") {
    //         console.log("got an ICEcandidate!!!")
    //         console.log(data)
    //         sendIceCandidateMessage(data)
    //     }
    // });
    //
    // socket.addEventListener('message', (ev) => {
    //     const data: OfferMessage = JSON.parse(ev.data)
    //     if (data.message === "offer") {
    //         console.log("got an offer!!!")
    //         console.log(data)
    //         answer(data)
    //     }
    // });
    //
    // const  answer = async (data:OfferMessage) => {
    //     console.log("before creating answer: rtcMessage=")
    //     console.log(data.rtcMessage)
    //     peerConnection.setRemoteDescription(data.rtcMessage)
    //     const sessionDescription = await peerConnection.createAnswer();
    //     peerConnection.setLocalDescription(sessionDescription)
    //     socket.send(JSON.stringify({
    //         message: 'answerOffer',
    //         calleeId: "1",
    //         rtcMessage: sessionDescription,
    //     }));
    //
    // }

    socket.addEventListener('message', (ev) => {
        const data: SocketMessage = JSON.parse(ev.data)
        if (data.message === "makeCall") {
            console.log('got make call!!!')
            console.log(data)
            console.log(ev.data)
            setCallList([{
                email: data.email,
                name: data.name,
                branch: data.branch,
                currentScreen: data.currentScreen,
                service: data.service,
                claimId: data.claimId,
                claimType: data.claimType,
                claimPhase: data.claimPhase
            }, ...callList])
        }
    })

    const setAcceptedCall = (callerId: number) => {
        remoteRTCMessage.current = "Hi";
        webRtcChannel.initChannel();
        socket.send(JSON.stringify({
            "message": "callAccepted",
            "callee": "100",
            "caller": callerId,
            "rtcMessage": "I accepted your call",
        }))
    }

    const sendIceCandidateMessage = (data: any) => {
        let message = data.rtcMessage;

        if (peerConnection) {
            peerConnection
                .addIceCandidate(new RTCIceCandidate(message.candidate))
                .then((data) => {
                    console.log("SUCCESS");
                })
                .catch((err) => {
                    console.log("Error", err);
                });
        }
    }

    socket.addEventListener("open", () => {
        console.log("Waiting for a call!!!!");
    })

    const handleEvent = () => {

    }

    peerConnection.onicecandidate = (event) => {
        console.log("onicecandidate called!!!")
        if (event.candidate) {
            // Alice sends serialized candidate data to Bob using Socket
            socket.send(JSON.stringify({
                message: 'candidate',
                calleeId: "1",
                rtcMessage: {
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                },
            }));
        } else {
            console.log("End of candidates.");
        }
    };

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
                        <CallPreview callEntries={callList} setAcceptedCall={setAcceptedCall}/>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;
