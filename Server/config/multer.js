import multer from 'multer';
import { removedash } from '../utils';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + removedash(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
