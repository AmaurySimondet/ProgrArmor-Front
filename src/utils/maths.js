const calculateMovingAverage = (data, key, windowSize = 20) => {
    // Sort data by date first
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate moving average using sliding window
    const averages = sortedData.map((item, index) => {
        const start = Math.max(0, index - windowSize + 1);
        const window = sortedData.slice(start, index + 1);
        const sum = window.reduce((acc, curr) => acc + curr[key], 0);
        return {
            date: item.date,
            average: sum / window.length
        };
    });

    return averages;
};

export { calculateMovingAverage };