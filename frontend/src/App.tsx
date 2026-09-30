import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ContentList from "./pages/ContentList";
import ContentPage from "./pages/ContentPage";
import MyPlants from "./pages/MyPlants";
import AddPlant from "./pages/AddPlant";
import Navigation from "./components/Navigation";

function App() {
  return (
    <BrowserRouter>
    <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/content" replace />} />
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/:id" element={<ContentPage />} />
        <Route path="/my-plants" element={<MyPlants />} />
        <Route path="/my-plants/add" element={<AddPlant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;