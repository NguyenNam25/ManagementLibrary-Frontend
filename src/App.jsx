import { BrowserRouter, Routes } from "react-router-dom";
import ManagerRoute from "./routes/ManagerRoute";
import ReaderRoutes from "./routes/ReaderRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {ManagerRoute}
        {ReaderRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;