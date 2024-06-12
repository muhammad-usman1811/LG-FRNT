import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, Stack, Drawer } from "@mui/material";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ChatInterface from "./components/ChatInterface";

const queryClient = new QueryClient();

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebarVisiblitly = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Box>
        <Header />
        <Stack direction="row" height="calc(100vh - 64px)">
          {isSidebarVisible && (
            <Drawer
              anchor="left"
              open={isSidebarVisible}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "80%",
                },
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              onClose={toggleSidebarVisiblitly}
            >
              <Sidebar isVisible={isSidebarVisible} />
            </Drawer>
          )}
          <Sidebar />
          <ChatInterface toggleSidebar={toggleSidebarVisiblitly} />
        </Stack>
      </Box>
    </QueryClientProvider>
  );
}

export default App;
