import * as React from 'react';
import './button.css';

export default function Button(props: {
    onClick: () => void;
    className?: string;
    primary?: true;
    children: React.ReactNode;
    styles?: { wrapper?: React.CSSProperties; button?: React.CSSProperties };
}): JSX.Element {
    return (
        <div className={['button-wrapper', props.className].join(' ')} style={props.styles?.wrapper}>
            <div
                className={['button', props.primary ? 'primary' : '', props.className].join(' ')}
                onClick={props.onClick}
                style={props.styles?.button}
            >
                {props.children}
            </div>
        </div>
    );
}
