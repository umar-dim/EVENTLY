import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
// Interface for the scanned QR code data

const QRReader: React.FC = () => {
  const [scannedData, setScannedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  const { profileImg } = location.state || {};
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    // Render the qr scanner
    scanner.render(
      (decodedText) => {
        setErrorMessage(null);
        try {
          //parse the data so we can display to test
          const parsedData = JSON.parse(decodedText);
          const formattedData = parsedData.time;

          setScannedData(formattedData);
        } catch (error) {
          setErrorMessage("Invalid QR code data format.");
          setScannedData(null);
        }
      },
      () => {
        //if there is an error display the error messsage
        setErrorMessage("Unable to scan the QR code. Try again.");
      }
    );

    // Cleanup scanner when the component unmounts
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner:", error);
      });
    };
  }, []);

  return (
    <>
      <Navbar profileImgUrl={profileImg} admin={false} />
      <div
        className="mt-10"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          padding: "10px",

          backgroundColor: "#f8f8f8",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: "10px 0",
            fontSize: "30px",
            textAlign: "center",
            color: "#000",
          }}
        >
          QR Code Scanner
        </h1>

        {/* QR Code Scanner */}
        <div
          id="reader"
          style={{
            width: "100%",
            maxWidth: "350px",
            aspectRatio: "1", // Maintain square
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        ></div>

        {/* Display Scanned Data */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            wordBreak: "break-word",
            width: "100%",
            maxWidth: "350px",
          }}
        >
          {scannedData ? (
            <>
              <h2
                style={{
                  fontSize: "24px",
                  color: "#000",
                  marginBottom: "10px",
                }}
              >
                Scanned Data:
              </h2>
              <p style={{ fontSize: "20px", color: "#000" }}>{scannedData}</p>
            </>
          ) : errorMessage ? (
            <p
              style={{
                fontSize: "18px",
                color: "red",
              }}
            >
              {errorMessage}
            </p>
          ) : (
            <p
              style={{
                fontSize: "18px",
                color: "#999",
              }}
            >
              No data scanned yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default QRReader;
