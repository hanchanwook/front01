import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import GuestBook from './pages/GuestBook';
import BookDetail from './pages/BookDetail';
import GuestBookWrite from './pages/GuestBookWrite';
import GuestBookUpdate from './pages/GuestBookUpdate';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardInsert from './pages/BoardInsert';
import BoardUpdate from './pages/BoardUpdate';

function App() {
 
  useEffect(()=>{
    const tokens = localStorage.getItem("tokens");
    if(tokens){
      useAuthStore.getState().zu_login();
    }
  },[]);

  return (
    <AuthProvider>
      <div className='app-container'>
        <BrowserRouter>
          <Header />
          <div className='main-content'>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route  path="/login" element={<Login />}/>
              <Route path="/signup" element={<Signup />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/productdetail/:id" element={<ProductDetail />} />
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />}/>
              <Route path="/guestbook" element={<GuestBook />} />
              <Route path="/bookdetail/:id" element={<BookDetail />} />
              <Route path="/guestbookwrite" element={<GuestBookWrite />} />
              <Route path="/guestbookupdate/:id" element={<GuestBookUpdate />} />
              <Route path="/boardlist" element={<BoardList />} />
              <Route path="/boarddetail/:id" element={<BoardDetail />} />
              <Route path="/boardinsert" element={<BoardInsert />} />
              <Route path="/boardupdate/:id" element={<BoardUpdate />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;