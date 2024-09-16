import { Signup as SignupComponent } from '../components'

function Signup() {
  console.log('in signup page...');
  
  return (
    <div className='py-8'>
        <SignupComponent />
    </div>
  )
}

export default Signup