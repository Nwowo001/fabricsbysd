import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure Cloudinary will be done in each route

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log('File filter:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload route working',
    cloudinary: {
      configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
    }
  });
});

// @desc    Upload product images
// @route   POST /api/upload/products
// @access  Private/Admin
router.post('/products', protect, authorize('admin'), upload.array('images', 5), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files?.length);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const uploadedImages = [];
    
    for (const file of req.files) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
              folder: 'fabricsbysd/products',
              transformation: [{ width: 800, height: 800, crop: 'fill' }]
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(file.buffer);
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
          alt: file.originalname
        });
      } catch (uploadError) {
        console.error('Individual upload error:', uploadError);
        throw uploadError;
      }
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/products/:publicId
// @access  Private/Admin
router.delete('/products/:publicId', protect, authorize('admin'), async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

export default router;