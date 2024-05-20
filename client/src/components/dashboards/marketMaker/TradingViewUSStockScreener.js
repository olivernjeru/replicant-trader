import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';

export default function TradingViewUSStockScreener() {
    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.innerHTML = JSON.stringify({
            width: '100%',
            height: 290,
            defaultColumn: 'overview',
            defaultScreen: 'most_capitalized',
            market: 'stocks',
            showToolbar: true,
            colorTheme: 'dark',
            locale: 'en',
        });

        // Select the widget container
        const widgetContainer = document.querySelector('.tradingview-widget-container__widget');
        if (widgetContainer) {
            widgetContainer.appendChild(script);
        }

        return () => {
            // Clean up the script on component unmount
            if (widgetContainer) {
                widgetContainer.innerHTML = '';
            }
        };
    }, []);

    return (
        <Container>
            <Box>
                <div className="tradingview-widget-container">
                    <div className="tradingview-widget-container__widget"></div>
                    <div className="tradingview-widget-copyright">
                        {/* TradingView Widget */}
                    </div>
                </div>
            </Box>
        </Container>
    );
}
