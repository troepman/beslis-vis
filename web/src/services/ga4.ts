import ReactGA from 'react-ga4';
const TRACKING_ID = 'G-W9K19P5Q0Z'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

function trackEvent(category: string, action: string, label: string) {
    console.log(`GA - ${category}: ${action} - ${label}`);
    ReactGA.event({
        category,
        action,
        label,
    });
}

export const GoogleAnalyticEvents = {
    navigation: {
        websiteLoad: (source: 'no_question' | 'with_question') => {
            trackEvent('navigation', 'website_load', source);
        },
        submitQuestion: (questionType: 'personal' | 'random' | 'top10') => {
            trackEvent('navigation', 'submit_question', questionType);
        },
        fishAnsweredStarted: () => {
            trackEvent('navigation', 'fish_answered_started', '');
        },
        fishAnsweredFinished: () => {
            trackEvent('navigation', 'fish_answered_finished', '');
        },
        share: (medium: string) => {
            trackEvent('navigation', 'share', medium);
        },
    },
};

export default GoogleAnalyticEvents;
