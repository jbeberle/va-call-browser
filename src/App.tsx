import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Box, CssBaseline, Grid, ThemeProvider} from "@mui/material";
import {theme} from "./assets/themes";
import CallPreview, {CallEntry} from "./components/CallPreview";


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
    callReason: string
    callClaimDescription: string
    claimId: string
    claimType: string
    claimPhase: string
    room: string
}

function App() {
    const [callList, setCallList] = useState<CallEntry[]>([]);


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
                        <CallPreview callEntries={callList}/>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;
