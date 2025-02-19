import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const useWebSocket = (role: string) => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(
                    role === "ADMIN" ? "/topic/admin" : "/topic/customer",
                    (message) => {
                        setMessages((prev) => [...prev, message.body]);
                    }
                );
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame);
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [role]);

    return messages;
};

export default useWebSocket;
