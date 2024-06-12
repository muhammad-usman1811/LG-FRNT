import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

const PDFViewer = ({ url, text, close }) => {
  const transformToolbarSlot = (slot) => ({
    ...slot,
    CurrentPageInput: () => <></>,
    CurrentPageLabel: () => <></>,
    GoToNextPage: () => <></>,
    GoToPreviousPage: () => <></>,
    NumberOfPages: () => <></>,
    Print: () => <></>,
    Open: () => <></>,
    DownloadMenuItem: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    ZoomIn: () => <></>,
    ZoomOut: () => <></>,
  });

  const renderToolbar = (Toolbar) => (
    <>
      <Toolbar>{renderDefaultToolbar(transformToolbarSlot)}</Toolbar>
      <IconButton onClick={close}>
        <CloseIcon />
      </IconButton>
    </>
  );

  const { renderDefaultToolbar } = toolbarPlugin();

  const layoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
    renderToolbar,
  });
  const searchPluginInstance = searchPlugin();
  const { highlight } = searchPluginInstance;

  const handleKeywordSearch = () => {
    highlight([text]);
  };

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer
        fileUrl={url}
        defaultScale={SpecialZoomLevel.PageFit}
        plugins={[layoutPluginInstance, searchPluginInstance]}
        onDocumentLoad={handleKeywordSearch}
      />
    </Worker>
  );
};

export default PDFViewer;
