import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect('http://localhost:5000');

function App() {
    const [me, setMe] = useState("");
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        });

        socket.on("me", (id) => {
            setMe(id);
        });

        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
    }, []);

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
    };



    return (
        <>
            <div className="container">
                <div className="video-container">
                    <div className="video-box">
                        <div className="video">
                            {stream && <video playsInline muted ref={myVideo} autoPlay style={{width: "400px"}}/>}
                        </div>
                    </div>
                    <div className="video-box">
                        <div className="video">
                            {callAccepted && !callEnded ?
                                <video playsInline ref={userVideo} autoPlay style={{width: "400px"}}/> :
                                <div style={{
                                    width: "400px",
                                    height: "300px",
                                    backgroundColor: "#f0f0f0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    Waiting for patient...
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="action-bar">
                    <button className="action-button">
                        <img src="assets/mic.png"  className="action-icon"/>
                        Mute
                    </button>
                    <button className="action-button">
                        <img src="assets/cam.png"  className="action-icon"/>
                        Camera Off
                    </button>
                    <button className="action-button primary">
                        <img src="assets/screen_share.png"  className="action-icon"/>
                        Share Screen
                    </button>
                    <button className="action-button danger">
                        <img src="assets/end_call.png"  className="action-icon"/>
                        End Call
                    </button>
                </div>

            </div>
        </>
    );
}

export default App;