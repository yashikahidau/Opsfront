function calculateSlaStatus(ticket) {
  if (!ticket.createdAt || !ticket.slaDueAt) {
    return "healthy";
  }

  const created =
    new Date(ticket.createdAt).getTime();

  const due =
    new Date(ticket.slaDueAt).getTime();

  const now = Date.now();

  if (now >= due) {
    return "breached";
  }

  const totalDuration =
    due - created;

  if (totalDuration <= 0) {
    return "healthy";
  }

  const elapsed =
    now - created;

  const progress =
    elapsed / totalDuration;

  if (progress >= 0.75) {
    return "warning";
  }

  return "healthy";
}

module.exports =
  calculateSlaStatus;