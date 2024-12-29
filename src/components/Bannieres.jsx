import React, { useState, useEffect } from 'react';

const Bannieres = ({ imageUrl, alt, url }) => {
    return (
        <div className="popInElement dashboard-banner">
            <img src={imageUrl} alt={alt} onClick={() => window.location.href = url} />
        </div>
    );
};

const AllBanners = ({ userId }) => {
    const [weather, setWeather] = useState({
        current: { temp: null, description: '' },
        tomorrow: { temp: null, description: '' },
        dayAfter: { temp: null, description: '' },
        city: 'Paris'
    });

    useEffect(() => {
        const PARIS_LAT = 48.8566;
        const PARIS_LON = 2.3522;
        const API_KEY = '1fd2e564c5a3d8ab439cf9553bb56277'; // Replace with your OpenWeather API key

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${PARIS_LAT}&lon=${PARIS_LON}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                setWeather({
                    current: {
                        temp: Math.round(data.current.temp),
                        description: data.current.weather[0].description
                    },
                    tomorrow: {
                        temp: Math.round(data.daily[1].temp.day),
                        description: data.daily[1].weather[0].description
                    },
                    dayAfter: {
                        temp: Math.round(data.daily[2].temp.day),
                        description: data.daily[2].weather[0].description
                    },
                    city: 'Paris'
                });
            })
            .catch(error => console.error('Error fetching weather:', error));
    }, []);

    const bannerImages = [
        { src: require('../images/bannieres/christmas.webp'), alt: 'Christmas', url: window.location.href },
        { src: require('../images/bannieres/Bannieres-Stats.webp'), alt: 'Stats', url: window.location.origin + '/compte?id=' + userId + '&activeTab=statistiques' },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                display: 'flex',
                gap: '20px',
                maxWidth: '700px',
                minWidth: '350px',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                position: 'relative',
                flexWrap: 'nowrap'
            }}>
                {bannerImages.map((banner, index) => (
                    <div key={index} style={{ flex: '0 0 auto' }}>
                        <Bannieres
                            imageUrl={banner.src}
                            alt={banner.alt}
                            url={banner.url}
                        />
                    </div>
                ))}
            </div>
            {/* <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>Today</div>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{weather.current.temp}°C</div>
                    <div style={{ fontSize: '0.9em', textTransform: 'capitalize' }}>{weather.current.description}</div>
                </div>
                <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>Tomorrow</div>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{weather.tomorrow.temp}°C</div>
                    <div style={{ fontSize: '0.9em', textTransform: 'capitalize' }}>{weather.tomorrow.description}</div>
                </div>
                <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>Day After</div>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{weather.dayAfter.temp}°C</div>
                    <div style={{ fontSize: '0.9em', textTransform: 'capitalize' }}>{weather.dayAfter.description}</div>
                </div>
            </div> */}
        </div>
    );
};

export default AllBanners;
