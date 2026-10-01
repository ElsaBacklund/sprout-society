import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContentList from "./pages/ContentList";
import ContentPage from "./pages/ContentPage";
import MyPlants from "./pages/MyPlants";
import AddPlant from "./pages/AddPlant";
import Navigation from "./components/Nav";
import AdminContent from "./pages/AdminContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/:id" element={<ContentPage />} />
        <Route path="/my-plants" element={<MyPlants />} />
        <Route path="/my-plants/add" element={<AddPlant />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;