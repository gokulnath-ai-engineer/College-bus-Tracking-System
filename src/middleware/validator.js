function validateTelemetry(req, res, next) {
  const latitude = Number(req.body.lat);
  const longitude = Number(req.body.lng);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ success: false, message: 'Valid latitude and longitude are required' });
  }
  return next();
}

module.exports = { validateTelemetry };
