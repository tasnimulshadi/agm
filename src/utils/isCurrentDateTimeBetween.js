const isCurrentDateTimeBetween = (startTime, endTime) => {
    // Get the current date and time
    const now = new Date();

    // Convert start and end times to Date objects
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if the current time is between the start and end times
    return now >= start && now <= end;
};

export default isCurrentDateTimeBetween;