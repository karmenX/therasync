import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";     //WebRTC bağlantı kütüphanesi
import "./VideoCall.css";

import mic from "../assets/mic.svg"
import cam from "../assets/cam.svg"
import share from "../assets/screen_share.svg"
import endcall from "../assets/end_call.svg"

function App() {
    const [me, setMe] = useState("");   //Kullanıcının serverdaki IDsi
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");   //Arayan kişinin IDsi
    const [callerSignal, setCallerSignal] = useState();     //WebRTC sinyal verisi
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [socket, setSocket] = useState(null);     //sunucu ile WebSocket bağlantısı
    const [isConnected, setIsConnected] = useState(false);
    const [isCamOff,setIsCamOff] = useState(true);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();     //WebRTC peer bağlantısı

    useEffect(() => {


        const ws = new WebSocket('ws://localhost:5000');    //  ws://localhost:5000 deki Websocket serverına bağlantı kur

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setSocket(ws);


        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        });


        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const handleWebSocketMessage = (data) => {
        switch (data.type) {
            case 'me':
                setMe(data.id);
                console.log('My ID:', data.id);
                break;
            case 'callUser':
                setReceivingCall(true);
                setCaller(data.from);
                setName(data.name);
                setCallerSignal(data.signal);
                console.log('Incoming call from:', data.from);
                break;
            case 'callAccepted':
                setCallAccepted(true);
                if (connectionRef.current) {
                    connectionRef.current.signal(data.signal);
                }
                break;
            case 'callEnded':
                setCallEnded(true);
                setReceivingCall(false);
                setCallAccepted(false);
                if (connectionRef.current) {
                    connectionRef.current.destroy();
                }
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    };

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            sendMessage({
                type: "answerCall",
                signal: data,
                to: caller
            });
        });

        peer.on("stream", (stream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        setCallAccepted(false);
        setReceivingCall(false);

        // Notify other peer about call end
        sendMessage({
            type: "leaveCall",
            to: caller || idToCall
        });

        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCamOff(!isCamOff);
        }
    };

    return (
        <>
            <div className="container">

                <div className="video-container">
                    <div className="video-box">
                        <div className="video">
                            {stream && <video playsInline muted ref={myVideo} autoPlay  style={{width: "400px"}}/>}
                        </div>
                    </div>
                    <div className="video-box">
                        <div className="video">
                            {callAccepted && !callEnded ?
                                <video playsInline ref={userVideo} autoPlay style={{width: "400px"}}/> :
                                <div style={{
                                    width: "400px",
                                    height: "300px",
                                    backgroundColor: "#757575",
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

                <div className="call-controls">

                        {receivingCall && !callAccepted && (
                            <div className="incoming-call">
                                <h3>{name} is calling...</h3>
                                <button
                                    onClick={answerCall}
                                    style={{ padding: "10px 20px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "4px" }}
                                >
                                    Answer
                                </button>
                            </div>
                        )}
                    </div>

                <div className="action-bar">
                    <button className="action-button" onClick={toggleMute}>
                        <img src={mic} className="action-icon" />
                        Mute/Unmute
                    </button>
                    <button className="action-button" onClick={toggleCamera}>
                        <img src={cam} className="action-icon" />
                        Camera Off/On
                    </button>
                    <button className="action-button primary">
                        <img src={share} className="action-icon" />
                        Share Screen
                    </button>
                    <button className="action-button danger" onClick={leaveCall}>
                        <img src={endcall} className="action-icon"/>
                        End Call
                    </button>
                </div>
            </div>
        </>
    );
}

export default App;