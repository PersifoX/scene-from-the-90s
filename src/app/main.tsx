import { createRoot } from "react-dom/client";
import { RoomPage } from "../pages/room";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/600.css";
import "./styles.css";
createRoot(document.getElementById("root")!).render(<RoomPage />);
