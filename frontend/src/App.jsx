import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import SearchPage from "./pages/SearchPage";
import AlertsPage from "./pages/AlertsPage";
import ChatList from "./pages/ChatList";
import ChatPage from "./pages/Chat";
import Polls from "./pages/Polls";
import GeneratePoll from "./pages/GeneratePoll";
import Marketplace from "./components/Marketplace";
import CreateListing from "./components/CreateListing";
import Events from "./pages/Event";
import CreateEvent from "./pages/CreateEvent";

import UpdateProfile from "./pages/Update";
import UserProfilePage from "./pages/UserProfile";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();

  // Routes where Header and Footer shouldn't appear
  const hideHeaderFooter = ["/login", "/register", "/chat/:id"];

  const showLayout = !hideHeaderFooter.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {showLayout && <Header />}

      <main className="pt-[72px] pb-16 px-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update" element={<UpdateProfile />} />{" "}
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/ai" element={<ChatPage />} />{" "}
          <Route path="/polls" element={<Polls />} /> {/* Poll page */}
          <Route path="/generate" element={<GeneratePoll />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/notifications" element={<AlertsPage />} />
          <Route path="/user/:id" element={<UserProfilePage />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>

      {showLayout && <Footer />}
    </div>
  );
}
