import {useState, useEffect} from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'
import Spinner from '../components/spinner/Spinner'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const userStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)
    // console.log("UserData [Home] ->",userData);

    useEffect(() => {
        setLoading(true)
        try {
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                    setLoading(false)
                }
            })
        } catch (error) {
            console.log("Home error -: ", error);
            setLoading(false)
        }
    }, [])

    if(loading) {
        return <Spinner />
    } 
    else if (!loading && posts.length === 0) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        {userStatus ? (
                            <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold hover:text-gray-500'>
                                No Posts are available...
                            </h1>
                        </div>
                        ) : (
                            <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold hover:text-gray-500'>
                                Login to read posts
                            </h1>
                        </div>
                        )}
                    </div>
                </Container>
            </div>
        )
    }

   return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        {/* try this way as well */}
                        {/* <PostCard post={post} /> */}    
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default Home