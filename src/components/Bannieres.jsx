import React, { useState, useEffect } from 'react';
import API from '../utils/API';
import { MiniLoader } from './Loader';
import { COLORS } from '../utils/constants';

const Bannieres = ({ imageUrl, alt, url }) => {
    return (
        <div className="popInElement dashboard-banner">
            <img src={imageUrl} alt={alt} onClick={() => window.location.href = url} />
        </div>
    );
};

const WeatherBanner = ({ weather }) => {
    return (
        <div className="popInElement dashboard-banner weather-banner" style={{ width: "400px" }}>
            <div className="weather-content">
                <div className="weather-city">Prévois ta séance à {weather.city} 👀</div>
                <div className="weather-day">
                    <div className="weather-label">Aujourd'hui</div>
                    <img src={weather.current.icon} alt={weather.current.label} />
                    <div className="weather-temp">{weather.current.temp}°C</div>
                    <div className="weather-desc">{weather.current.description_fr}</div>
                </div>
                <div className="weather-divider" />
                <div className="weather-day">
                    <div className="weather-label">Demain</div>
                    <img src={weather.tomorrow.icon} alt={weather.tomorrow.label} />
                    <div className="weather-temp">{weather.tomorrow.temp}°C</div>
                    <div className="weather-desc">{weather.tomorrow.description_fr}</div>
                </div>
                <div className="weather-divider" />
                <div className="weather-day">
                    <div className="weather-label">Après-demain</div>
                    <img src={weather.dayAfter.icon} alt={weather.dayAfter.label} />
                    <div className="weather-temp">{weather.dayAfter.temp}°C</div>
                    <div className="weather-desc">{weather.dayAfter.description_fr}</div>
                </div>
            </div>
        </div>
    );
};

const FeaturesBanner = () => {
    return (
        <div className="popInElement dashboard-banner weather-banner features-banner" style={{ width: "315px" }}>
            <h3 className="features-title" style={{ width: "315px", fontSize: "15px" }}>Dernières features 🎉</h3>
            <ul className="features-list">
                <li>Implémentation complete des commentaires:
                    <ul>
                        <li>modifier, supprimer, identifier, répondre et notifications associées</li>
                    </ul>
                </li>
                <li>Minuteur pour stalker entre 2 séries 😜</li>
            </ul>
        </div>
    );
};

const CreateSeanceBanner = () => {
    return (
        <div className="popInElement dashboard-banner weather-banner features-banner" style={{ backgroundColor: COLORS.PROGARMOR }}>
            <div className="features-list"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '150px', fontSize: '16px', padding: '10px', color: 'white' }}
                onClick={() => window.location.href = window.location.origin + '/session'}>
                <div style={{ fontSize: '36px' }}>✍️</div>
                <div>Enregistre ta séance !</div>
            </div>
        </div>
    );
};

const FeedbackBanner = () => {
    return (
        <div className="popInElement dashboard-banner weather-banner features-banner" style={{ backgroundColor: COLORS.PROGARMOR }}>
            <div className="features-list"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '150px', fontSize: '16px', padding: '10px', color: 'white' }}
                onClick={() => window.location.href = window.location.origin + '/aide#feedback'}>
                <div style={{ fontSize: '36px' }}>💬</div>
                <div>Un bug ? Une suggestion ?</div>
            </div>
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
    const [loading, setLoading] = useState(true);
    const PARIS_LAT = 48.8566;
    const PARIS_LON = 2.3522;
    const [location, setLocation] = useState(null);
    const bannerImages = [
        { src: require('../images/bannieres/Bannieres-Stats.webp'), alt: 'Stats', url: window.location.origin + '/compte?id=' + userId + '&activeTab=statistiques' },
    ];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            // On error or denied permission, fall back to Paris
            () => {
                setLocation({ lat: PARIS_LAT, lon: PARIS_LON });
            }
        );
        setLoading(true);
    }, []);

    useEffect(() => {
        // Only fetch weather when we have a location
        if (location) {
            API.getWeather({ lat: location.lat, lon: location.lon, userId: userId })
                .then(response => {
                    setWeather(response.data);
                })
                .catch(error => console.error('Error fetching weather:', error))
                .finally(() => setLoading(false));
        }
    }, [location]);

    if (loading) {
        return <MiniLoader />
    }

    return (
        <div className="popInElement" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                display: 'flex',
                gap: '20px',
                maxWidth: '90%',
                minWidth: '350px',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                position: 'relative',
                flexWrap: 'nowrap',
                paddingLeft: '20px',
                paddingRight: '20px'
            }}>
                {/* <CreateSeanceBanner /> */}
                <FeedbackBanner />
                {/* <FeaturesBanner /> */}
                {bannerImages.map((banner, index) => (
                    <div key={index} style={{ flex: '0 0 auto' }}>
                        <Bannieres
                            imageUrl={banner.src}
                            alt={banner.alt}
                            url={banner.url}
                        />
                    </div>
                ))}
                <WeatherBanner weather={weather} />
            </div>
        </div>
    );
};

export default AllBanners;
