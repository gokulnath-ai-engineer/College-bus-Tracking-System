const state = require('../db/inMemoryStore');
const { etaMinutes } = require('../services/geoService');
const { updateGps } = require('../services/trackingService');

function studentDashboard(req, res) {
  const student = state.students.find((item) => item.student_id === req.params.student_id) || state.students[0];
  const bus = state.buses.find((item) => item.bus_id === student.assigned_bus_id);
  const route = bus ? state.routes.find((item) => item.route_id === bus.route_id) : null;
  const stop = route ? route.stops.find((item) => item.stop_id === student.pickup_stop_id) : null;
  res.json({ student, assigned_bus: bus || null, route, pickup_stop: stop, eta_mins: bus && bus.trip_status === 'Running' ? etaMinutes(bus, stop) : 'N/A', notifications: state.notifications.slice(0, 5) });
}

function overview(req, res) {
  res.json({ buses: state.buses, drivers: state.drivers, students: state.students, routes: state.routes, reports: { total_buses: state.buses.length, active_buses: state.buses.filter((bus) => bus.trip_status === 'Running').length, available_today: state.buses.filter((bus) => bus.availability_today === 'Available').length, total_students: state.students.length }, logs: state.logs });
}

function driverDashboard(req, res) {
  const driver = state.drivers.find((item) => item.driver_id === req.params.driver_id) || state.drivers[0];
  const bus = state.buses.find((item) => item.bus_id === driver.assigned_bus_id);
  res.json({ driver, bus: bus || null, route: bus ? state.routes.find((item) => item.route_id === bus.route_id) : null, history: [] });
}

function tripStatus(req, res) {
  const bus = state.buses.find((item) => item.bus_id === req.body.bus_id);
  if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
  bus.trip_status = req.body.trip_status;
  state.logs.unshift({ event: 'TRIP_STATUS_CHANGE', timestamp: new Date().toISOString() });
  return res.json({ success: true, bus });
}

function gpsUpdate(req, res) {
  const bus = updateGps(req.body);
  if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
  return res.json({ success: true, bus });
}

function gpsBatch(req, res) {
  if (!Array.isArray(req.body.updates)) return res.status(400).json({ success: false, message: 'updates must be an array' });
  const buses = req.body.updates.map(updateGps).filter(Boolean);
  return res.json({ success: true, processed: buses.length, buses });
}

function changeAvailability(req, res) {
  const bus = state.buses.find((item) => item.bus_id === req.body.bus_id);
  if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
  bus.availability_today = req.body.availability_today;
  if (bus.availability_today === 'Not Available') bus.trip_status = 'Not Running';
  return res.json({ success: true, bus });
}

function assignStudent(req, res) {
  const student = state.students.find((item) => item.student_id === req.body.student_id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  student.assigned_bus_id = req.body.assigned_bus_id;
  student.pickup_stop_id = req.body.pickup_stop_id;
  return res.json({ success: true, student });
}

function analytics(req, res) {
  const totalBuses = state.buses.length;
  const runningBuses = state.buses.filter((bus) => bus.trip_status === 'Running').length;
  res.json({ total_buses: totalBuses, running_buses: runningBuses, utilization_percent: totalBuses ? Math.round((runningBuses / totalBuses) * 100) : 0, total_students: state.students.length });
}

module.exports = { studentDashboard, driverDashboard, overview, tripStatus, gpsUpdate, gpsBatch, changeAvailability, assignStudent, analytics };
