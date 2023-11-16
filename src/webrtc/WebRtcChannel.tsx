import {SignalingChannel} from "./SignalingChannel";

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
    signalingChannel: SignalingChannel ;

    constructor(socket: WebSocket) {
        newMessage = null;
        this.signalingChannel = new SignalingChannel(socket);
    }


    sendSocketMessage(message:any) {
        console.log("Sending message over data channel:")
        console.log(message)
        this.signalingChannel.send(message)
    }
}

