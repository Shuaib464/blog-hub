import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authSlice'
import {Input, Button, Logo} from './index'
import authService  from '../appwrite/auth'
import {useForm} from 'react-hook-form'
import Spinner from '../components/spinner/Spinner'

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setError('');
        setLoading(true)
        console.log("data -> ",data);
        
        try {
           const session = await authService.login(data);
           if(session) {
                const userData = await authService.getCurrentUser();
                console.log("Login user data -> ", userData);
                if(userData) {
                    dispatch(authLogin(userData));
                    setLoading(false)
                    navigate('/');
                }
           }
        } catch (error) {
            setError(error);
            console.log(error);
        }
    }
  
  if(loading) {
        return(
            <div>
                <Spinner />
            </div>
        )
  } else{
    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`mx-auto w-full max-w-lg bg-gray-200 rounded-xl p-10 border border-black/10`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'>
                    Sign in into your account 
                </h2>
                <p className='mt-2 text-center text-base text-black/60'>
                        Don&apos;t have any account?&nbsp;
                        <Link 
                            to='/signup'
                            className='font-medium text-primary transition-all duration-200 hover:underline'>
                                Sign Up
                        </Link>
                </p>
                { error && <p className='text-red-600 mt-8 text-center'>{error}</p> }
    
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input 
                            label = "Email: "
                            placeholder = 'Enter your email'
                            type = 'email'
                            {...register('email', {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                                    .test(value) ||
                                    'Email address must be a valid address'
                                }
                            })}
                        />
                        <Input 
                            label = "Password: "
                            placeholder = "Enter your password"
                            type = "password"
                            {...register("password", {
                                required: true
                            })}
                        />
                        <Button
                            type='submit'
                            className='w-full'
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )
  }
}

export default Login