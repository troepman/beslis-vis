import React, { useEffect } from 'react';
import './bubble-container.css';

function setupBubblesAnimation() {
    const bubbles = Array.from(document.getElementsByClassName('bubble')) as HTMLDivElement[];
    function generateState(i: number, init = false) {
        const paddingWidth = 50;
        const contentWidth = window.innerWidth - 2 * paddingWidth;
        return [
            paddingWidth + (i + Math.random()) * (contentWidth / bubbles.length),
            (init ? Math.random() : 1) * window.innerHeight,
            Math.random() * 50 + 50,
        ];
    }
    const states = bubbles.map((_, i) => generateState(i, true));
    function animate() {
        bubbles.forEach((bubble, i) => {
            const state = states[i];
            state[1] -= 1;
            if (state[1] < -100) {
                const n = generateState(i);
                state[0] = n[0];
                state[1] = n[1];
            }
            bubble.style.top = state[1] + 'px';
            bubble.style.left = state[0] - state[2] / 2 + 'px';
            bubble.style.width = bubble.style.height = state[2] + 'px';
        });

        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}

export default function BubbleContainer() {
    useEffect(() => setupBubblesAnimation(), []);
    return (
        <div className="bubble-wrapper">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
        </div>
    );
}
