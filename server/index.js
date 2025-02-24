import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

let submissions = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    employeeId: 'ABC-12345',
    phoneNumber: '1 (555) 555-5555',
    salary: 50000,
    startDate: '2020-01-01',
    supervisorEmail: 'supervisor1@the4d.com',
    costCenter: 'SA-212-XYZ',
    projectCode: 'PRJ-2024-004',
    privacyConsent: true,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    employeeId: 'ABC-12344',
    phoneNumber: '1 (555) 555-5555',
    salary: 60000,
    startDate: '2020-02-01',
    supervisorEmail: 'supervisor2@the4d.com',
    costCenter: 'ON-323-ABC',
    projectCode: 'PRJ-2024-003',
    privacyConsent: true,
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    employeeId: 'ABC-12346',
    phoneNumber: '1 (555) 555-5555',
    salary: 55000,
    startDate: '2020-03-01',
    supervisorEmail: 'supervisor3@the4d.com',
    costCenter: 'NN-211-DSA',
    projectCode: 'PRJ-2024-001',
    privacyConsent: false,
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Williams',
    employeeId: 'ABC-12347',
    phoneNumber: '1 (555) 555-5555',
    salary: 58000,
    startDate: '2020-04-01',
    supervisorEmail: 'supervisor4@the4d.com',
    costCenter: 'AN-923-CAS',
    projectCode: 'PRJ-2024-002',
    privacyConsent: true,
  },
];

app.use(express.static(join(__dirname, '../dist')));

app.post('/api/submit', (req, res) => {
  const formData = {
    id: Date.now().toString(),
    ...req.body,
  };
  submissions.push(formData);
  res.json({ data: formData });
});

app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// File uploads endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  // Validate file type
  if (fileType !== 'text/csv' && fileType !== 'text/plain') {
    fs.unlinkSync(filePath); // Delete the file
    return res.status(400).json({
      error: 'Invalid file type. Only CSV and TXT files are allowed.',
    });
  }

  // Process the file
  if (fileType === 'text/csv') {
    processCSV(filePath, res);
  } else if (fileType === 'text/plain') {
    processTXT(filePath, res);
  }
});

// Process CSV files
const processCSV = (filePath, res) => {
  //const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => submissions.push(data))
    .on('end', () => {
      fs.unlinkSync(filePath); // Delete the file after processing
      res.json(submissions);
    })
    .on('error', (error) => {
      fs.unlinkSync(filePath); // Delete the file on error
      res.status(500).json({ error: 'Failed to process CSV file' });
    });
};

// Process TXT files
const processTXT = (filePath, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      fs.unlinkSync(filePath); // Delete the file on error
      return res.status(500).json({ error: 'Failed to process TXT file' });
    }

    const lines = data.split('\n').filter((line) => line.trim() !== '');

    lines.forEach((line) => {
      const [
        id,
        firstName,
        lastName,
        employeeId,
        phoneNumber,
        salary,
        startDate,
        supervisorEmail,
        costCenter,
        projectCode,
        privacyConsent,
      ] = line.split(',');

      submissions.push({
        id,
        firstName,
        lastName,
        employeeId,
        phoneNumber,
        salary: parseFloat(salary),
        startDate,
        supervisorEmail,
        costCenter,
        projectCode,
        privacyConsent: privacyConsent.trim().toLowerCase() === 'true',
      });
    });

    fs.unlinkSync(filePath); // Delete the file after processing
    res.json(submissions);
  });
};
