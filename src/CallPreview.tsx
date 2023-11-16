import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Box, CssBaseline, Grid, ThemeProvider, Typography} from "@mui/material";
import {theme} from "./assets/themes";
import {useState} from "react";

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
}


const CallPreview = (props: CallEntryType) => {

    const [rowSelected, setRowSelected] = useState<boolean>(false);

    const onRowsSelectionHandler = (ids:any[]) => {
        console.log("onRowsSelectionHandler!")
        const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
        if(selectedRowsData !== undefined && selectedRowsData.length > 0) {
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
                        }}>The preview contains only pending calls.   Click on checkbox to start a conversation.</Typography>
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
                {rowSelected ?
                <Grid item xs={12}>
                    <Box sx={{background: '#ffffff', paddingTop: "40px"}}>
                        <Typography color="black" variant="h6" sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingBottom: "40px"
                        }}>This pane contains the chat to selected call.</Typography>
                    </Box>
                </Grid>
                : <></>}
            </Grid>
        </ThemeProvider>
    )
}

export default CallPreview