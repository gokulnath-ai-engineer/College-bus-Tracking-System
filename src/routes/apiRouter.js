const express = require('express');
const controller = require('../controllers/apiController');
const { validateTelemetry } = require('../middleware/validator');

const router = express.Router();
router.get('/student/dashboard/:student_id', controller.studentDashboard);
router.get('/driver/dashboard/:driver_id', controller.driverDashboard);
router.post('/driver/trip-status', controller.tripStatus);
router.post('/gps/update', validateTelemetry, controller.gpsUpdate);
router.post('/telemetry/batch', controller.gpsBatch);
router.get('/admin/overview', controller.overview);
router.post('/admin/bus/availability', controller.changeAvailability);
router.post('/admin/student/assign', controller.assignStudent);
router.get('/analytics', controller.analytics);
module.exports = router;
