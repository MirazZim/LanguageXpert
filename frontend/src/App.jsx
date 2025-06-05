import { Route, Routes } from "react-router"
import HomePage from "./Pages/HomePage.jsx"
import LoginPage from "./Pages/LoginPage.jsx"
import SignupPage from "./Pages/SignupPage.jsx"
import OnboardingPage from "./Pages/OnboardingPage.jsx"
import NotificationsPage from "./Pages/NotificationsPage.jsx"
import CallPage from "./Pages/CallPage.jsx"
import ChatPage from "./Pages/ChatPage.jsx"

const App = () => {
  return (
    <div className="h-screen">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App