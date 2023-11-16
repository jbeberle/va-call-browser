import React, { useState, useEffect, useRef } from "react";
import "./Chats.scss";

interface Props {
    userResponse: string;
    botResponse: {
        purpose: string;
        message: string;
        options?: string[];
        sender: string;
    };
    sendUserResponse: string;
}

interface MessagesInfo {
    purpose?: string;
    message: string;
    options?: string[];
    sender: string;
}

const Chats: React.FC<Props> = props => {
    const [messages, setMessages] = useState<MessagesInfo[]>([]);
    const dummyRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    // stacking up messages
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    purpose: "introduction",
                    message:
                        "Hi there.  Welcome to the VA Assistant.  How can I help you?",
                    sender: "bot"
                }
            ]);
        } else {
            let tempArray = [...messages];
            tempArray.push({ message: props.sendUserResponse, sender: "user" });
            setMessages(tempArray);

            setTimeout(() => {
                let temp2 = [...tempArray];
                temp2.push(props.botResponse);
                setMessages(temp2);
            }, 1000);
        }
    }, [props.sendUserResponse, props.botResponse]);

    // enable autoscroll after each message
    useEffect(() => {
        if (dummyRef && dummyRef.current && bodyRef && bodyRef.current) {
            bodyRef.current.scrollTo({
                top: dummyRef.current.offsetTop,
                behavior: "smooth"
            });
        }
    }, [messages]);

    return (
        <div className="message-container" ref={bodyRef} key="ChatID">
            {messages.map(chat => (
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
            ))}
        </div>
    );
};

export default Chats;
