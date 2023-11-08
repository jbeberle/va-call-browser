import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import * as io from "socket.io-client";
import {Box, CssBaseline, Grid, ThemeProvider} from "@mui/material";
import {theme} from "./assets/themes";
import CallPreview, {CallEntry} from "./CallPreview";


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

function App() {
  let sourceCallerId = "1"
  let destCallerId = "5";
  const [callList, setCallList] = useState<CallEntry[]>([]);

  // if(deviceId === "3dc3ea2df8d8e7e7") {
  //     sourceCallerId = "5"
  //     destCallerId = "1"
  // }

  const room = "88"
  sourceCallerId = "1"
  destCallerId = "2"
  const sdpOffer = "3"
  const socket = new WebSocket('ws://10.0.0.242:8080/socket')
  console.log("connected to websocket")
  console.log(socket)
  socket.addEventListener('message', (ev) => {
    const data:SocketMessage = JSON.parse(ev.data)
    if(data.message === "makeCall") {
      console.log('got make call!!!')
      console.log(data)
      console.log(ev.data)
      setCallList([{email: data.email, name: data.name, branch: data.branch, currentScreen: data.currentScreen, service: data.service, claimId: data.claimId, claimType: data.claimType, claimPhase: data.claimPhase}, ...callList])
    }
  })

  const setAcceptedCall = () => {
    alert('Accepted Call!!!')
    socket.send(JSON.stringify({"message": "callAccepted"}))
  }

  // websocket.onopen(() => console.log("web Socket got connected!!!!"))
  socket.addEventListener("open", () => {
    console.log("Waiting for a call!!!!");
  })

  const handleEvent = () => {

  }

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
