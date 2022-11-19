import * as React from 'react';
import GoogleAnalyticEvents from '../services/ga4';
import Button from './button';
import whatsAppImg from './whatsapp.png';

function formatShareUrl() {
    const url = location.href + '&utm_source=share';
    return url;
}

export default function ShareButtons(props: { question: string; answer: string }): JSX.Element {
    const url = formatShareUrl();
    const standardText = "Ik vroeg me af '" + props.question + "' en dit zei de vis: " + url;
    const defaultStyle = { minWidth: 'unset', width: 48 };
    const whatsAppStyle = { ...defaultStyle, backgroundColor: '#25D366' };

    return (
        <div
            className="share-button-container"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
        >
            <Button
                onClick={() => {
                    GoogleAnalyticEvents.navigation.share('copy');
                    navigator.clipboard.writeText(standardText);
                }}
                styles={{
                    button: { ...defaultStyle, backgroundColor: '#cfcfcf' },
                }}
            >
                <span className="material-symbols-outlined">content_copy</span>
            </Button>
            <Button
                className="only-mobile"
                onClick={() => {
                    GoogleAnalyticEvents.navigation.share('whatsapp_mobile');
                    window.open('whatsapp://send?text=' + encodeURIComponent(standardText), '_blank')?.focus();
                }}
                styles={{ button: whatsAppStyle }}
            >
                <img src={whatsAppImg} height="24" width="24" />
            </Button>
            <Button
                className="hide-mobile"
                onClick={() => {
                    GoogleAnalyticEvents.navigation.share('whatsapp_web');
                    window
                        .open('https://web.whatsapp.com/send?text=' + encodeURIComponent(standardText), '_blank')
                        ?.focus();
                }}
                styles={{ button: whatsAppStyle }}
            >
                <img src={whatsAppImg} height="24" width="24" />
            </Button>
        </div>
    );
}
