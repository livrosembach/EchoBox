import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import SendFeedback from './components/SendFeedbacks';
import RegisterCompany from './components/RegisterCompany';
import FeedbackTicketDetail from './components/FeedbackTicketDetail';
import './css/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/send_feedback" element={<SendFeedback />} />
          <Route path="/register_company" element={<RegisterCompany />} />
          <Route path='/feedback_detail/:id' element={<FeedbackTicketDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
