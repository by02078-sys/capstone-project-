// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Simple API Test Suite', () => {

  // A public, safe sandbox API for testing endpoints
  const BASE_API_URL = 'https://jsonplaceholder.typicode.com';

  test('GET Request - Validate User Profile Data', async ({ request }) => {
    // 1. Fire a GET request to /users/1
    const response = await request.get(`${BASE_API_URL}/users/1`);

    // 2. Assert that the HTTP Status code is 200 (OK)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // 3. Parse the underlying raw stream into a JSON object
    const responseBody = await response.json();

    // 4. Assert specific properties inside the JSON data object
    expect(responseBody.id).toBe(1);
    expect(responseBody.name).toBe('Leanne Graham');
    expect(responseBody.email).toBe('Sincere@april.biz');
    
    // Check nested objects within the JSON profile mapping
    expect(responseBody.company.name).toBe('Romaguera-Crona');
  });

  test('POST Request - Create a New Data Resource Record', async ({ request }) => {
    // 1. Fire a POST request along with a data payload body
    const response = await request.post(`${BASE_API_URL}/posts`, {
      data: {
        title: 'Playwright API Capstone',
        body: 'Testing backend pipelines using built-in request hooks.',
        userId: 1,
      },
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    });

    // 2. Assert that the record was created successfully (HTTP 201 Created)
    expect(response.status()).toBe(201);

    // 3. Verify the echoed payload properties back from the server response
    const responseBody = await response.json();
    expect(responseBody.title).toBe('Playwright API Capstone');
    expect(responseBody.userId).toBe(1);
    
    // The sandbox server automatically assigns a tracking ID to the new asset
    expect(responseBody).toHaveProperty('id');
  });

});