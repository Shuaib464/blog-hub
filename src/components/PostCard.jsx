import { Link } from "react-router-dom"
import appwriteService from '../appwrite/config'

function PostCard({$id, title, featuredImage}) {
  // console.log("featuredImg - ",featuredImage)
  return (
    <Link to={`/post/${$id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4 shadow-md duration-200 hover:scale-105">
            <div className="w-full justify-center mb-4">
                <img src={appwriteService.getFilePreview(featuredImage)} alt={title} />
            </div>
            <h2 className="text-xl font-bold">
                {title}
            </h2>
        </div>
    </Link>
  )
}

export default PostCard