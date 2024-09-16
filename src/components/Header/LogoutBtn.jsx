import {logout} from '../../store/authSlice'
import authService from '../../appwrite/auth'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const logoutHandler = () => {
        authService.logout()
                        .then(() => { 
                          console.log("logged out...");
                          dispatch(logout()) 
                          navigate('/')
                        })
                        .catch((error) => console.log('LogoutBtn :: error', error)
                        )
    }
  return (
    <button 
        className='inline-block px-6 py-2 duration-200 bg-red-200 
      hover:bg-white hover:text-red-600 hover:scale-95 rounded-full'
        onClick={logoutHandler}>
            Logout
    </button>
  )
}

export default LogoutBtn