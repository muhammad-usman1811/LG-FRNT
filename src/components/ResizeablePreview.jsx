import React, { useState, useEffect, useRef } from "react";
import PDFViewer from "./PDFViewer";

const ResizablePreview = ({ documentSrc, text, onClose }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [iframeWidth, setIframeWidth] = useState(300);
  const iframeRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = startX - e.clientX;
      let newWidth = iframeWidth + deltaX;

      // Ensure new width is within bounds
      newWidth = Math.max(newWidth, 300); // Minimum width

      setIframeWidth(newWidth);
      setStartX(e.clientX);
      //   const newWidth = iframeWidth + deltaX;

      //   if (newWidth > 0) {
      //     setIframeWidth(newWidth);
      //     setStartX(e.clientX);
      //   }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, iframeWidth]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
  };

  useEffect(() => {
    if (iframeRef.current && handleRef.current) {
      const rect = iframeRef.current.getBoundingClientRect();
      handleRef.current.style.left = `${rect.left}px`;
    }
  }, [iframeWidth]);

  return (
    <>
      <div
        ref={iframeRef}
        style={{
          border: "none",
          cursor: isResizing ? "col-resize" : "default",
          pointerEvents: isResizing ? "none" : "auto",
          position: "absolute",
          right: 0,
          transition: isResizing ? "none" : "right 0.1s linear",
          minWidth: 300,
          height: "calc(100vh - 64px)",
        }}
        onMouseMove={(e) => {
          if (isResizing) return;
          e.stopPropagation();
        }}
      >
        <PDFViewer url={documentSrc} text={text} close={onClose} />
      </div>
      {/* <iframe
        ref={iframeRef}
        src={documentSrc}
        title="Resizable iframe"
        width={iframeWidth}
        style={{
          border: "none",
          cursor: isResizing ? "col-resize" : "default",
          pointerEvents: isResizing ? "none" : "auto",
          position: "absolute",
          right: 0,
          transition: isResizing ? "none" : "right 0.1s linear",
          minWidth: 300,
          height: "calc(100vh - 64px)",
        }}
        onMouseMove={(e) => {
          if (isResizing) return;
          e.stopPropagation();
        }}
      /> */}
      {!isResizing && (
        <div
          ref={handleRef}
          style={{
            position: "absolute",
            width: 4,
            height: "100%",
            background: "transparent",
            right: iframeWidth - 2,
            //left: 0,
            top: 0,
            zIndex: 999,
            cursor: "col-resize",
          }}
          onMouseDown={handleMouseDown}
        />
      )}
    </>
  );
};

export default ResizablePreview;
