import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ContentList from "./pages/ContentList";
import ContentPage from "./pages/ContentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/content" replace />} />
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/:id" element={<ContentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;