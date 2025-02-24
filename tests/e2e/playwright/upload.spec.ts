import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('should upload a CSV file directly to the API', async ({}) => {
  const apiContext = await request.newContext();

  // Read the sample CSV file
  const filePath = path.join('./tests/test-files/sample.csv');
  const fileBuffer = fs.readFileSync(filePath);

  // Send a multipart/form-data request to the API
  const response = await apiContext.post('http://localhost:3000/api/upload', {
    multipart: {
      file: {
        name: 'sample.csv',
        mimeType: 'text/csv',
        buffer: fileBuffer,
      },
    },
  });

  // Ensure API returns a successful status
  expect(response.status()).toBe(200);

  // Parse JSON response
  const jsonResponse = await response.json();

  // Validate API response
  expect(jsonResponse).toBeInstanceOf(Array);
  expect(jsonResponse.length).toBeGreaterThan(0);
  expect(jsonResponse[0]).toHaveProperty('firstName');
  expect(jsonResponse[0]).toHaveProperty('lastName');
});
