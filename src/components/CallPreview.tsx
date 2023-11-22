import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Box, CssBaseline, Grid, ThemeProvider, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getCalls} from "../communication/VetCallApi";
import {theme} from "../assets/themes";

export interface CallEntry {
    id: string
    email: string
    fullName: string
    screen: string
    branch: string
    service: string
    callReason: string
    callClaimDescription: string
    claimId: string
    claimType: string
    claimPhase: string
}

export type CallEntryType = {
    callEntries: CallEntry[],
}


const CallPreview = (props: CallEntryType) => {

    const [rowSelected, setRowSelected] = useState<boolean>(false);
    const [updateState, setUpdateState] = useState<number>(0)
    let done = false;

    function delay(ms: number): Promise<typeof setTimeout> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getMessages = async () => {
        for (var i = 0; i < 3000 && !done; i++) {
            await delay(1000);
            let calls = await getCalls().then((result) => {
                return result
            }) as any
            if (typeof calls == 'object') {
                setRows(calls as CallEntry[]);
            } else if (typeof calls == 'string') {
                done = true;
            }
        }
    }

    useEffect(() => {
        done = false;
        getMessages();
        return () => {
            done = true;
        }
    }, []);


    const onRowsSelectionHandler = (ids: any[]) => {
        console.log("onRowsSelectionHandler!")
        const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
        if (selectedRowsData !== undefined && selectedRowsData.length > 0) {
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
            field: 'fullName',
            headerName: 'Caller Name',
            width: 280,
        },
        {
            field: 'email',
            headerName: 'Email Address',
            width: 280,
            type: 'string',
        },
        {
            field: 'callReason',
            headerName: 'Call Reason',
            type: 'string',
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
            field: 'screen',
            headerName: 'Current Screen',
            type: 'string',
            width: 150,
        },
        {
            field: 'callClaimDescription',
            headerName: 'Claim Description',
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

    const [rows, setRows] = useState<CallEntry[]>([]);


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
            </Grid>
        </ThemeProvider>
    )
}

export default CallPreview