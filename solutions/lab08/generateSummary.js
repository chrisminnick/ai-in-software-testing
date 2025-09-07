function generateSummary(text) {
  // Simulate AI behavior
  if (!text || text.length < 10) return 'Input too short.';
  return `Summary: ${text.slice(0, 50)}...`;
}

module.exports = { generateSummary };
