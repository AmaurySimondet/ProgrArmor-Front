import { useState, useEffect } from 'react';

// Custom hook to manage window dimensions
const useWindowDimensions = () => {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
        };

        let timeout;
        const debouncedHandleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleResize, 200);
        };

        window.addEventListener('resize', debouncedHandleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, []);

    return dimensions;
};

export { useWindowDimensions };
