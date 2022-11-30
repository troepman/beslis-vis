import * as React from 'react';
import goldfishImg from './goldfish.png';
import './about.css';

export default function AboutPage() {
    return (
        <div className="about-content">
            <div className="about-presentation-container">
                <div className="about-presentation-text">
                    <h1>About</h1>
                    <p>Hoi, ik ben Sanka en vandaag wil ik jouw helpen.</p>
                </div>
                <img className="about-presentation-img" src={goldfishImg} />
            </div>
            <p>
                Het is vaak lastig om een keuze te maken, dat weet ik maar al te goed. Als goudvis sta ik elke dag voor
                een hoop keuzes.
            </p>
        </div>
    );
}
