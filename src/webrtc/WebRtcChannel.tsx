import {SignallingChannel} from "./SignallingChannel";
import {Media} from "./Media";

let newMessage: string |  null = null;

export const getNewMessage = (): string | null => {
    const message = newMessage;
    newMessage = null;
    return message;
}

export const setNewMessage = (message: string) => {
    newMessage = message;
}

export class WebRtcChannel {
    iceConfiguration: RTCConfiguration;

    peerConnection: RTCPeerConnection ;
    signalingChannel: SignallingChannel ;
    dataChannel: RTCDataChannel ;
    // addMessage: FormProps | null = null;


    // constructor(addMessage: FormProps) {
    constructor(socket: WebSocket) {
        // this.addMessage = addMessage;
        this.iceConfiguration = {
            iceServers: [
                {
                    urls: 'turn:jim.vmware.com:3478',
                    username: 'ejim',
                    credential: 'TannerAndTobey100!'
                }
            ]
        }

        newMessage = null;
        this.peerConnection = new RTCPeerConnection(this.iceConfiguration);
        this.signalingChannel = new SignallingChannel(this.peerConnection, socket);
        this.dataChannel = this.peerConnection.createDataChannel("dataChannel");
        console.log("Created new data channel")

        this.dataChannel.addEventListener('error', (error) => {
            console.log(`Event Error ${error}`)
        })
        this.dataChannel.onerror = function (error) {
            console.log("Error:", error);
        };

        this.dataChannel.addEventListener('close', () => {
            console.log(`Event Data Channel is Closed`)
        })
        this.dataChannel.onclose = function () {
            console.log("Data channel is closed");
        };

        this.dataChannel.addEventListener('open', () => {
            console.log(`Event Data Channel is Opened`)
        })
        this.dataChannel.onopen = function () {
            console.log("Data channel is opened");
        };

        this.dataChannel.addEventListener('message', (event) => {
            console.log(`Event Data Channel Message: ${event.data}`)
        })
        this.dataChannel.onmessage = function (event) {
            console.log("Message:", event.data);
            newMessage = event.data;
            // addMessage.setSendUserResponse(event.data);
        };

        this.peerConnection.ondatachannel =  (event) => {
            this.dataChannel = event.channel;
        };


        this.peerConnection.onicecandidate =  (event) => {
            if (event.candidate) {
                this.signalingChannel.send({
                    event: "candidate",
                    data: event.candidate
                });
            }
        }
    }

    async initChannel()  {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.createOffer((offer) => {
            this.signalingChannel.send({
                event : "offer",
                data : offer
            });
            this.peerConnection.setLocalDescription(offer);
        }, function(error) {
            // Handle error here
        });

        const media: Media = new Media(this.peerConnection);
    }

    sendDataChannelMessage(message: any) {
        this.dataChannel.send(message);
    }

    sendSocketMessage(message:any) {
        console.log("Sending message over data channel:")
        console.log(message)
        this.signalingChannel.send(message)
    }


}

