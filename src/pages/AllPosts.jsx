import { useState, useEffect } from "react"
import { Container, PostCard } from "../components"
import appwriteService from '../appwrite/config'
import { Query } from "appwrite"
import { useSelector } from "react-redux"
import Spinner from "../components/spinner/Spinner"

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const userId = useSelector(state => state.auth.userData.$id)
    console.log("userId in [AllPosts] -> ",userId );
    

    useEffect(() => {
        console.log("in useeffect...");
        setLoading(true)
        try {
            appwriteService.getPosts([Query.equal('userId', userId)]).then((posts) => {
                if (posts) {
                    console.log("in useeffect...",posts);
                    setPosts(posts.documents)
                    setLoading(false)
                }
            })
        }    
         catch (error) {
            console.log('Error while fetching posts [allPosts] - ', error)
        }
    
    }, [])

  if(loading) {
        return  <Spinner />
  } else {
    return (
        <div className="w-full py-8">
            <Container>
                {
                    posts.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {posts.map((post) => (
                                <div key={post.$id} className="py-2 w-1/4 duration-200 hover:scale-105">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xl font-bold text-gray-600">You do not have any post...</div>
                    )
                }
            </Container>
        </div>
      )
  }
}

export default AllPosts