import cloudinary from '../config/cloudinary.js'

export const uploadToCloudinary = async (file, folder = 'astro-satguru') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return {
      url: 'cloudinary-not-configured',
      publicId: null,
      originalName: file.originalname,
    }
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'auto',
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    originalName: file.originalname,
  }
}
