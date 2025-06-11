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
import CategoryManager from './components/CategoryManager';
import StatusManager from './components/StatusManager';
import AdminPanel from './components/AdminPanel';
import UserManager from './components/UserManager';
import CompanyManager from './components/CompanyManager';
import FeedbackManager from './components/FeedbackManager';
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
          <Route path='/feedback/:id' element={<FeedbackTicketDetail />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path='/admin/categories' element={<CategoryManager />} />
          <Route path='/admin/statuses' element={<StatusManager />} />
          <Route path='/admin/users' element={<UserManager />} />
          <Route path='/admin/companies' element={<CompanyManager />} />
          <Route path='/admin/feedbacks' element={<FeedbackManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
