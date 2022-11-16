import * as React from 'react';
import Button from './button';
import whatsAppImg from './whatsapp.png';

export default function ShareButtons(props: { question: string; url: string }): JSX.Element {
    const standardText = 'Ik vroeg me af ' + props.question + ' en dit zei de vis: ' + props.url;
    const defaultStyle = { minWidth: 'unset', width: 48 };
    const whatsAppStyle = { ...defaultStyle, backgroundColor: '#25D366' };

    return (
        <div
            className="share-button-container"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
        >
            <Button
                onClick={() => {
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
                    window.open('whatsapp://send?text=' + encodeURIComponent(standardText), '_blank')?.focus();
                }}
                styles={{ button: whatsAppStyle }}
            >
                <img src={whatsAppImg} height="24" width="24" />
            </Button>
            <Button
                className="hide-mobile"
                onClick={() => {
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
