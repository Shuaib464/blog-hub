import {useState} from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'
import {Input, Button, Logo} from './index'
import Spinner from './spinner/Spinner'

function Signup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit} = useForm();

    const create = async (data) => {
        setLoading(true)
        try {
            setError('')
            console.log("data -: ", data);
            const user = await authService.createAccount(data)
            if(user) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(data))
                setLoading(false)
                navigate('/')
            }
            
        } catch (error) {
            setLoading(false)
            setError(error)
        }
    }
  
  if(loading) {
     <Spinner />
  } else {
    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'>
                    Sign up to create account 
                </h2>
                <p className='mt-2 text-center text-base text-black/60'>
                        Already have an account?&nbsp;
                        <Link 
                            to='/login'
                            className='font-medium text-primary transition-all duration-200 hover:underline'>
                                Sign In
                        </Link>
                </p>
                { error && <p className='text-red-600 mt-8 text-center'>{error}</p> }
    
                <form onSubmit={handleSubmit(create)} >
                    <div className='space-y-5'>
                        <Input 
                            label= "Full Name : "
                            placeholder = "Enter your full name"
                            type = 'text'
                            {...register('name', {
                                required: true,
                            })}
                        />
                        <Input 
                            label= "Email : "
                            placeholder = "Enter your email"
                            type = 'email'
                            {...register('email', {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                                    .test(value) || 
                                    "Email address must be a valid address"
                                }
                            })}
                        />
                        <Input 
                            label= "Password : "
                            placeholder = "Enter password"
                            type = 'password'
                            {...register('password', {
                                required: true,
                            })}
                        />
                        <Button type='submit' className='w-full'>
                            Create Account
                        </Button>
                    </div>
                </form>
    
            </div>
        </div>
      )
  }
}

export default Signup