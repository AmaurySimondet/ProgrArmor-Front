import React, { useEffect } from 'react';

const GoogleAd = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6994486003941491"
                data-ad-slot="XXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6994486003941491"
                crossOrigin="anonymous"
            ></script>
        </div>
    );
};

export default GoogleAd;
