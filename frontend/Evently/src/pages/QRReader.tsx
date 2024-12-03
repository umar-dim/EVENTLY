import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const QRReader: React.FC = () => {
  const [scannedData, setScannedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  const { profileImg } = location.state || {};
  const navigate = useNavigate();
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 300, height: 300 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Decoded Text:", decodedText); // Inspect the data
        try {
          // Validate the decodedText before sending it
          const payload = { msg: decodedText };

          let request = await fetch("https://www.evently.wiki/checkQR", {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const result = await request.json();

          if (!request.ok) {
            console.error("Error response from server:", result.error);
            alert(result.error);
          } else {
            navigate(`/qr-success`, {
              state: {
                profileImg: profileImg,
              },
            });
            alert(result.success);
          }

          const parsedData = JSON.parse(decodedText);
          const formattedData = parsedData.time;
          setScannedData(formattedData);
        } catch (error) {
          console.error("Error handling QR code:", error);
          setErrorMessage("Invalid QR code data format.");
          setScannedData(null);
        }
      },
      () => {
        setErrorMessage("Unable to scan the QR code. Try again.");
      }
    );

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
            maxWidth: "500px",
            height: "500px",
            backgroundColor: "#e0e0e0", // Light gray background for better contrast
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
                color: "#000",
              }}
            >
              {errorMessage}
            </p>
          ) : (
            <p
              style={{
                fontSize: "18px",
                color: "#000",
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
