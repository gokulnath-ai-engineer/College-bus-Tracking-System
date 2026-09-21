const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../server');

test('API exposes the student dashboard', async () => {
  const server = app.listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/student/dashboard/STU-101`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.student.student_id, 'STU-101');
  } finally {
    server.close();
  }
});

test('backend supports telemetry validation, batch sync, admin updates, and analytics', async () => {
  const server = app.listen(0);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
    const invalidGps = await fetch(`${baseUrl}/api/v1/gps/update`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ bus_id: 'BUS-01', lat: 300, lng: 80 })
    });
    assert.equal(invalidGps.status, 400);

    const batch = await fetch(`${baseUrl}/api/v1/telemetry/batch`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ updates: [{ bus_id: 'BUS-01', lat: 13.08, lng: 80.27, speed: 20 }] })
    });
    assert.equal(batch.status, 200);
    assert.equal((await batch.json()).processed, 1);

    const availability = await fetch(`${baseUrl}/api/admin/bus/availability`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ bus_id: 'BUS-01', availability_today: 'Not Available' })
    });
    assert.equal(availability.status, 200);

    const analytics = await fetch(`${baseUrl}/api/analytics`);
    assert.equal(analytics.status, 200);
    assert.equal(typeof (await analytics.json()).utilization_percent, 'number');
  } finally {
    server.close();
  }
});
