import React from 'react';
import './screen.css';

export default function Screen(
    props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & { visible: boolean }>,
) {
    return (
        <div {...props} style={{ ...props.style, ...(!props.visible ? { display: 'none' } : {}) }} className="screen">
            {props.children}
        </div>
    );
}
