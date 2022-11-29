import * as React from 'react';
import questionMarkImg from './question_mark.png';
import './faq.css';

function QuestionItem(props: { question: string; answer: string }) {
    return (
        <div className="faq-question-container">
            <span className="faq-question-question">{props.question}</span>
            <span className="faq-question-answer">{props.answer}</span>
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="faq-content">
            <div className="faq-presentation-container">
                <img className="faq-presentation-img" src={questionMarkImg} />
                <h1 className="faq-presentation-text">Fishy Asked Questions</h1>
            </div>
            <div className="faq-question-list">
                <QuestionItem
                    question="Kan ik het antwoord van de beslisvis beïnvloeden?"
                    answer="Goeie vraag! Nee helaas. Onze beslisvis bepaald zelfstandig welke kant hij op zwemt. Je kunt een vraag wel
                meerdere keren stellen en het antwoord zal niet elke keer hetzelfde zijn!"
                />
                <QuestionItem
                    question="Ik kreeg eerst nee en nu ja als antwoord, wat moet ik doen?"
                    answer="Oeh dat is vervelend, blijkbaar heb je een echt dilemma te pakken. Laat de derde keer uitsluitsel geven!"
                />
            </div>
        </div>
    );
}
