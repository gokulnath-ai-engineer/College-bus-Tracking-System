const state = {
  routes: [{ route_id: 'R-1', route_name: 'Central Station to Campus', stops: [
    { stop_id: 'S1', name: 'Central Railway Station', lat: 13.0827, lng: 80.2707, sequence: 1 },
    { stop_id: 'S2', name: 'Anna Nagar Roundtana', lat: 13.085, lng: 80.21, sequence: 2 },
    { stop_id: 'S3', name: 'Koyambedu Bus Terminal', lat: 13.0694, lng: 80.1948, sequence: 3 },
    { stop_id: 'S4', name: 'College Main Gate', lat: 13.01, lng: 80.14, sequence: 4 }
  ] }],
  buses: [{ bus_id: 'BUS-01', bus_no: 'TN-01-CB-101', route_id: 'R-1', driver_id: 'DRV-01', capacity: 50, availability_today: 'Available', trip_status: 'Running', current_lat: 13.0827, current_lng: 80.2707, speed: 35, heading: 240, last_updated: new Date().toISOString() }],
  drivers: [{ driver_id: 'DRV-01', name: 'Ramesh Kumar', phone: '+91 98765 43210', assigned_bus_id: 'BUS-01' }],
  students: [{ student_id: 'STU-101', name: 'Ananya Sharma', roll_no: '21CS01', assigned_bus_id: 'BUS-01', pickup_stop_id: 'S2' }],
  notifications: [{ id: 1, type: 'System', message: 'Tracking system is online.', time: new Date().toLocaleTimeString() }],
  logs: []
};

module.exports = state;
