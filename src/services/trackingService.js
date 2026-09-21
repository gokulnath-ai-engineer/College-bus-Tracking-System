const state = require('../db/inMemoryStore');
const { distanceMeters } = require('./geoService');
const { approachingMeters, arrivalMeters } = require('../config/constants');

function updateGps(data) {
  const bus = state.buses.find((item) => item.bus_id === data.bus_id);
  if (!bus) return null;
  bus.current_lat = Number(data.lat);
  bus.current_lng = Number(data.lng);
  bus.speed = Number(data.speed) || 0;
  bus.heading = Number(data.heading) || 0;
  bus.last_updated = new Date().toISOString();
  const route = state.routes.find((item) => item.route_id === bus.route_id);
  if (route && bus.trip_status === 'Running') {
    route.stops.forEach((stop) => {
      const distance = distanceMeters(bus.current_lat, bus.current_lng, stop.lat, stop.lng);
      if (distance <= arrivalMeters || (distance <= approachingMeters && distance > arrivalMeters)) {
        state.notifications.unshift({ id: Date.now(), type: distance <= arrivalMeters ? 'Arrival' : 'Approaching', message: `Bus ${bus.bus_no} is near ${stop.name}.`, time: new Date().toLocaleTimeString() });
      }
    });
  }
  return bus;
}

module.exports = { updateGps };
