import {useDispatch} from 'react-redux'
import './App.css'
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { useEffect, useState } from 'react';
import {Header, Footer} from './components'
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()  
  // const navigate = useNavigate();

  useEffect(() => {
    // if(authService.isAuthenticated()) {
      
    // } else {
    //   navigate('/login')
    // }
    authService.getCurrentUser()
      .then((userData) => {
          if(userData) {
            dispatch(login({userData}))
          } else {
            dispatch(logout())
          }
      })
      .catch((error) => {
          console.log("App :: useEffect error ", error);
          console.log('bolo...');
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap bg-slate-50'>
        <div className='w-full block'>
            <Header />
            <main>
              <Outlet />
            </main>
            <Footer />
        </div>
    </div>
  ) : null;
}

export default App
