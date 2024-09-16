import {useCallback, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from '../../appwrite/config'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function PostForm({post, slug}) {
    const navigate = useNavigate()
    console.log("post is [postForm] -> ",post);

    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
                                                                            defaultValues: {
                                                                                title: post?.title || '',
                                                                                slug: slug || '',
                                                                                content:post?.content || '',
                                                                                status: post?.status || 'active'
                                                                            }
                                                                        })
    const userData = useSelector((state) => state.auth.userData);
    // console.log("userData [postform] -> ",userData);
    
    const submit = async (data) => {
        if (post) {
            // upload image
            const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null
            // console.log("uploadImg [postForm] -> ",file);
            // delete old image
            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }
            // update post
            const dbPost = await appwriteService.updatePost
                                                    (post.$id, {
                                                        ...data,
                                                        featuredImage: file ? file.$id : undefined
                                                    })
            // console.log('DB post [PostForm] -> ',dbPost);
            
            // navigate
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            // console.log('get img -',data.image[0]);
            // console.log('get img -',data);
            
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
            console.log("img file - ", file);
            
            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({
                                                ...data,
                                                userId: userData.$id
                                            })
                console.log('dvpost -: ',dbPost);
                
                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            /* one way */
            const slug = value.toLowerCase().replace(/ /g, '-')
            setValue('slug', slug)
            return slug

            /* HITESH way */
            // return value
            //         .trim()
            //         .toLowerCase()
            //         .replace(/^[a-zA-Z\d\s]+/g, '-')
            //         .replace(/\s/g, '-')
        }
        
        // return ''
    }, [])

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === 'title') {
                setValue('slug', slugTransform(value.title,
                                            {shouldValidate: true}
                ))
            }
        })

        return () => {
            subscription.unsubscribe();
        }
    }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
    </form>
  )
}

export default PostForm