import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'audio/mpeg', 'audio/wav', 'audio/webm']
    cb(null, allowed.includes(file.mimetype))
  },
})
