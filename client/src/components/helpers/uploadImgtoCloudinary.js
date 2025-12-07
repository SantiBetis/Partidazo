const uploadImageToCloudinary = ( userImage, handleInputChange) => {
    const data = new FormData()
    data.append("file", userImage)
    data.append("upload_preset", "chat-app")
    data.append("cloud_name","full-stack-apps")
    fetch("https://api.cloudinary.com/v1_1/full-stack-apps/image/upload",{
    method:"post",
    body: data
    })
    .then( res => res.json())
    .then(data => {
        console.log(data.url)
        handleInputChange('imgSrc',data.url)
    })
    .catch(err => console.log(err))
}

export default uploadImageToCloudinary;