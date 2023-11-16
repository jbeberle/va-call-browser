import {setNewMessage} from "./WebRtcChannel";

export class SignalingChannel {
    signalingChannel:WebSocket ;

    constructor(signalingChannel: WebSocket) {
        this.signalingChannel = signalingChannel;

        this.signalingChannel.addEventListener('message', (message) => {
            console.log(`Received message: ${message}`);
            console.log(message);
            console.log(message.data);
            let obj = JSON.parse(message.data);
            console.log(obj);
            if (obj?.event === "chat") {
                console.log("I got a chat message")
                console.log(obj?.message)
                if(obj?.from === "1") {
                   setNewMessage(obj?.message)
                }
            }
        });

    }

    send(message:any) {
        console.log(`sending message: ${JSON.stringify(message)}`);
        this.signalingChannel.send(JSON.stringify(message));
    }
}



