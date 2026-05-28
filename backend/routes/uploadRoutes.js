import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadToCloudinary } from '../services/uploadService.js'

const router = express.Router()

router.post(
  '/',
  protect,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const file = await uploadToCloudinary(req.file)
    res.status(201).json({ success: true, file })
  }),
)

export default router
