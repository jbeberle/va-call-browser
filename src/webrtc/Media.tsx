export const video_constraints = {
    video: true,
    audio: true
};
export const audio_constraints = {
    video: false,
    audio: true
};

export class Media {

    init() {
        function hasUserVideoMedia() {
            //check if the browser supports the WebRTC
            return !!(navigator.mediaDevices.getUserMedia(video_constraints)).catch((e) => console.log(e));
            ;
        }

        function hasUserAudioMedia() {
            //check if the browser supports the WebRTC
            return !!(navigator.mediaDevices.getUserMedia(audio_constraints)).catch((e) => console.log(e));
            ;
        }

        if (document.getElementById(("myVideo"))) {
            if (hasUserVideoMedia()) {
                //enabling video and audio channels
                navigator.mediaDevices.getUserMedia(video_constraints).then(function (stream) {
                    var video: HTMLVideoElement | null = document.querySelector('video');
                    console.log("Got videos stream!")

                    //inserting our stream to the video tag
                    video!.srcObject = stream;
                }, function (err) {
                }).catch((e) => console.log(e));
                ;
            }
            else {
                alert("WebRTC Video is not supported");
            }
        }

        if (document.getElementById("myAudio")) {
            if (hasUserAudioMedia()) {
                navigator.mediaDevices.getUserMedia(audio_constraints).then(function (stream) {
                    var audio: HTMLAudioElement | null = document.querySelector('audio');
                    console.log("Got audio stream!")

                    //inserting our stream to the video tag
                    audio!.srcObject = stream;
                }, function (err) {
                }).catch((e) => console.log(e));
                ;
            }
            else {
                alert("WebRTC Audio is not supported");
            }
        }
    }

    constructor(peerConnection: RTCPeerConnection) {
        // navigator.mediaDevices.getUserMedia(constraints).
        // then(function(stream) { /* use the stream */ })
        //     .catch(function(err) { /* handle the error */ });
        this.init();
        this.openStream(peerConnection).catch((e) => console.log(e));
    }

    setListener(peerConnection: RTCPeerConnection) {
        console.log("setListener called")
        let audioElement: HTMLAudioElement = document.getElementById("myAudio") as HTMLAudioElement;
        peerConnection.ontrack = function (event) {
            console.log("ontrack called")
            //if(audioElement != null) {audioElement!.srcObject = event!.streams[0];}
        };
    }

    async openStream(peerConnection: RTCPeerConnection) {
        this.setListener(peerConnection)
        console.log("Open stream")
        if (document.getElementById("myVideo")) {
            const gumStream = await navigator.mediaDevices.getUserMedia(video_constraints);
            for (const track of gumStream.getTracks()) {
                console.log("Adding track")
                peerConnection.addTrack(track, gumStream);
            }
        }
        if (document.getElementById("myAudio")) {
            const gumStream = await navigator.mediaDevices.getUserMedia(audio_constraints);
            for (const track of gumStream.getTracks()) {
                console.log("Adding track")
                peerConnection.addTrack(track, gumStream);
            }
        }
    }
}


