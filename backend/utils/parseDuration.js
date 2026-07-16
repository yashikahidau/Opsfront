function parseDuration(duration) {
  if (!duration) {
    return 0;
  }

  const value = parseInt(duration, 10);

  if (Number.isNaN(value)) {
    return 0;
  }

  const unit = duration
    .toLowerCase()
    .replace(/[0-9]/g, "")
    .trim();

  switch (unit) {
    case "m":
      return value * 60 * 1000;

    case "h":
      return value * 60 * 60 * 1000;

    case "d":
      return value * 24 * 60 * 60 * 1000;

    default:
      return value * 60 * 60 * 1000;
  }
}

module.exports = parseDuration;