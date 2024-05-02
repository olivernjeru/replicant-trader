import React, { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour12: false, timeZoneName: 'short' }) // Include time zone
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour12: false, timeZoneName: 'short' }));
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup function to prevent memory leaks
  }, []);

  return <span>{currentTime}</span>;
};

export default TimeDisplay;
