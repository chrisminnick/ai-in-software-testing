function parseDate(str) {
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  // Additional validation: check if the date string was actually valid
  // by comparing the parsed components with the original string
  if (str && str.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = str.split('-').map(Number);

    // Create a new date using UTC to avoid timezone issues
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    if (
      utcDate.getUTCFullYear() !== year ||
      utcDate.getUTCMonth() !== month - 1 ||
      utcDate.getUTCDate() !== day
    ) {
      throw new Error('Invalid date');
    }
  }

  return date;
}

export { parseDate };
