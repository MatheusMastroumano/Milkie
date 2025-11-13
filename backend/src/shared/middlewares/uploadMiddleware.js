import fileUpload from 'express-fileupload';

const uploadMiddleware = fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  abortOnLimit: true,
});

export default uploadMiddleware;