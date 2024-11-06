import React, { useEffect, useState } from "react";
import * as SignalR from "@microsoft/signalr";

type SignalrContextType = {
  // isOrderActive: boolean;
  // setIsOrderActive: React.Dispatch<React.SetStateAction<boolean>>;
  connection: SignalR.HubConnection | null;
};
export const SignalrContext = React.createContext<SignalrContextType>({
  connection: null,
  // isOrderActive: false,
  // setIsOrderActive: () => {},
});
export default function SignalrProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connection, setConnection] = useState<SignalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl("http://vktrng.ddns.net:8080/order-hub")
      .withAutomaticReconnect()
      .configureLogging(SignalR.LogLevel.Debug)
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .catch((err) => console.error("Error establishing connection: ", err));

    return () => {
      newConnection.stop();
    };
  }, []);

  // isOrderActive, setIsOrderActive
  return (
    <SignalrContext.Provider value={{ connection }}>
      {children}
    </SignalrContext.Provider>
  );
}
