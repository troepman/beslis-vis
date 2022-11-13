import * as React from 'react';
import './button.css';

export default function Button(props: {
    onClick: () => void;
    className?: string;
    primary?: true;
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div className="button-wrapper">
            <div
                className={['button', props.primary ? 'primary' : '', props.className].join(' ')}
                onClick={props.onClick}
            >
                {props.children}
            </div>
        </div>
    );
}
