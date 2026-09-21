const { earthRadiusMeters } = require('../config/constants');

function distanceMeters(lat1, lng1, lat2, lng2) {
  const radians = Math.PI / 180;
  const dLat = (lat2 - lat1) * radians;
  const dLng = (lng2 - lng1) * radians;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * radians) * Math.cos(lat2 * radians) * Math.sin(dLng / 2) ** 2;
  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function etaMinutes(bus, stop) {
  if (!bus || !stop || bus.speed <= 0) return 'N/A';
  return Math.max(1, Math.round(distanceMeters(bus.current_lat, bus.current_lng, stop.lat, stop.lng) / (bus.speed * 1000 / 60)));
}

module.exports = { distanceMeters, etaMinutes };
