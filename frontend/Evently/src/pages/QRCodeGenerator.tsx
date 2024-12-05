import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import useWebSocket from "react-use-websocket";
import Navbar from "../components/Navbar";
const QRCodeGenerator: React.FC = () => {
  const WS_URL = "wss://www.evently.wiki";
  const [socketUrl, _setSocketUrl] = useState(WS_URL);
  const [qrCodeEncrypt, setQRCodeEncrypt] = useState();
  const {
    sendMessage: _sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  // Listen for incoming messages
  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      setQRCodeEncrypt(message.data);
    }
  }, [lastMessage]);

  const intervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const connectionStatus =
    {
      0: "Connecting",
      1: "Open",
      2: "Closing",
      3: "Closed",
    }[readyState as 0 | 1 | 2 | 3] || "Unknown";

  console.log(`data sent over is${JSON.stringify(qrCodeEncrypt)}`);
  console.log("Connection Status:", connectionStatus);

  return (
    <>
      <Navbar profileImgUrl={"empty"} admin={true} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "800px",
          height: "600px",
          margin: "50px auto",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <h1>QR Code!!</h1>
        {qrCodeEncrypt && (
          <QRCodeCanvas
            id="qr-code-canvas"
            value={JSON.stringify(qrCodeEncrypt)}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        )}
      </div>
    </>
  );
};
export default QRCodeGenerator;
