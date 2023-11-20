import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Box, Button, CssBaseline, Grid, TextField, ThemeProvider, Typography} from "@mui/material";
import {theme} from "./assets/themes";
import {useEffect, useRef, useState} from "react";
import {MessagesInfo} from "./MessagesInfo";
import {WebRtcChannel} from "./webrtc/WebRtcChannel";

export interface CallEntry {
    email: string
    name: string
    currentScreen: string
    branch: string
    service: string
    claimId: string
    claimType: string
    claimPhase: string
}

export type CallEntryType = {
    callEntries: CallEntry[],
    setAcceptedCall: (callerId: number) => void
    channel: WebRtcChannel
}


const CallPreview = (props: CallEntryType) => {
    const messages = useRef<MessagesInfo[]>([]);
    const dummyRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    const [rowSelected, setRowSelected] = useState<boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [sendUserResponse, setSendUserResponse] = useState<MessagesInfo>({message: "", sender: ""});
    const [updateState, setUpdateState] = useState<number>(0)
    const webRtcChannel:WebRtcChannel = props.channel


    useEffect(() => {
        console.log("in useEffect:  messages = ")
        console.log(messages)
        if (messages.current.length === 0) {
            messages.current = ([
                {
                    purpose: "introduction",
                    message:
                        "Hi there.  Welcome to the VA Assistant.  How can I help you?",
                    sender: "bot"
                }
            ]);
            setUpdateState(Math.random())
        } else {
            console.log("Else clause")
            console.log(sendUserResponse)
            let tempArray = [...messages.current];
            if (typeof sendUserResponse === 'string') {
                tempArray.push({message: sendUserResponse, sender: "user"});
            } else {
                tempArray.push(sendUserResponse)
            }
            console.log("tempArray=")
            console.log(tempArray)
            messages.current = tempArray;
            setUpdateState(Math.random())

            // setTimeout(() => {
            //     let temp2 = [...tempArray];
            //     // temp2.push(botResponse);
            //     // messages.current = temp2;
            // }, 1000);
        }
    }, [sendUserResponse]);

    const onRowsSelectionHandler = (ids: any[]) => {
        console.log("onRowsSelectionHandler!")
        const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
        if (selectedRowsData !== undefined && selectedRowsData.length > 0) {
            props.setAcceptedCall((selectedRowsData as any[])[0].id)
            console.log(selectedRowsData);
            setRowSelected(true)
        }
    };


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'email',
            headerName: 'Email Address',
            width: 280,
            type: 'string',
        },
        {
            field: 'callerName',
            headerName: 'Caller Name',
            width: 280,
        },
        {
            field: 'branch',
            headerName: 'Branch',
            width: 250,
        },
        {
            field: 'service',
            headerName: 'Service',
            width: 100,
        },
        {
            field: 'currentScreen',
            headerName: 'Current Screen',
            type: 'string',
            width: 150,
        },
        {
            field: 'claimId',
            headerName: 'Claim ID',
            type: 'string',
            width: 150,
        },
        {
            field: 'claimType',
            headerName: 'Claim Type',
            type: 'string',
            width: 150,
        },
        {
            field: 'claimPhase',
            headerName: 'Claim Phase',
            type: 'string',
            width: 100,
        },
    ];


    const rows = props.callEntries.map((entry, index) => {
        return {
            id: index,
            email: entry.email,
            callerName: entry.name,
            branch: entry.branch,
            currentScreen: entry.currentScreen,
            service: entry.service,
            claimId: entry.claimId,
            claimType: entry.claimType,
            claimPhase: entry.claimPhase,
        }
    })


    async function sendMessage(message: string) {
        webRtcChannel.sendSocketMessage({event:"chat", from:"2", to:"`", message:message})
    }



    const handleSend = (ev: any) => {
        ev.preventDefault()
        alert(`msg=${currentMessage}`);
        messages.current.push({message:currentMessage, sender:"callcenter"})
        setSendUserResponse!({message:currentMessage, sender:"callcenter"})
        sendMessage(currentMessage)
        setCurrentMessage('');
    }



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Grid container>
                <Grid item sx={{paddingLeft: "30px", paddingTop: "30px", paddingBottom: "25px"}} xs={12}>
                    <Box>
                        <Typography color="white" variant="h4">Incoming Calls</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{background: '#344B57', paddingTop: "40px"}}>
                        <Typography color="white" variant="h6" sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingBottom: "40px"
                        }}>The preview contains only pending calls. Click on checkbox to start a
                            conversation.</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{height: 400, width: '100%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 20,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            onRowSelectionModelChange={(ids: any[]) => onRowsSelectionHandler(ids)}
                        />
                    </Box>
                </Grid>
                {false ?
                    <>
                        <Grid item xs={12}>
                            <Box sx={{background: '#ffffff', paddingTop: "40px", marginBottom: "20px"}}>
                                <Typography color="black" variant="h6" sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingBottom: "40px"
                                }}>
                                </Typography>
                                <div className="message-container" ref={bodyRef} key="ChatID">
                                    {
                                        messages.current.map(chat => {
                                        console.log("chat=")
                                        console.log(chat)
                                        return (
                                        <div key={chat.message}>
                                            <div className={`message ${chat.sender}`}>
                                                <p>{chat.message}</p>
                                            </div>
                                            {chat.options ? (
                                                <div className="options">
                                                    <div>
                                                        <i className="far fa-hand-pointer"></i>
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div ref={dummyRef} className="dummy-div"></div>
                                        </div>
                                    )})}
                                </div>
                                {/*<label font-size="4px">*/}
                                {/*<input type="text" name="name" value={formData.message} />*/}
                                {/*<form  noValidate autoComplete="off">*/}
                                {/*</form>*/}
                                {/*</label>*/}
                            </Box>
                        </Grid>
                        <Grid item xs={3}/>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                hiddenLabel
                                id="filled-hidden-label-small"
                                placeholder="Chat Text"
                                defaultValue=""
                                variant="filled"
                                size="small"
                                value={currentMessage}
                                onChange={(e) => {
                                    setCurrentMessage(e.target.value);
                                }}
                                // helperText="Chat Text to Send"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button sx={{marginLeft: "20px"}} variant="contained" onClick={handleSend}>Send</Button>
                        </Grid>

                    </>
                    : <></>}
            </Grid>
        </ThemeProvider>
    )
}

export default CallPreview