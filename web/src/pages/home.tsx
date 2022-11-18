import * as React from 'react';
import Button from '../components/button';
import { useSubmit } from 'react-router-dom';
import GoogleAnalyticEvents from '../services/ga4';
import './home.css';

function formatQuestion(q: string) {
    q = q.trim();
    if (!q.endsWith('?')) {
        q += '?';
    }
    return q;
}

function generateRandomQuestion(): string {
    const randomQuestions = ['Heb ik zin in koffie?', 'Trek ik een korte broek aan?', 'Ga ik uit vanavond?'];
    return randomQuestions[Math.round(Math.random() * (randomQuestions.length - 1))];
}

export default function HomePage() {
    const submit = useSubmit();
    const [state, setState] = React.useState<{ question: string }>({ question: '' });

    const submitQuestion = React.useCallback(
        (sanitizedQuestion: string) => {
            const formData = new FormData();
            formData.append('q', sanitizedQuestion);
            submit(formData, { action: '/answer', method: 'get' });
        },
        [submit],
    );
    const submitPersonalQuestion = React.useCallback(
        (question: string) => {
            const sanitizedQuestion = formatQuestion(question);
            if (sanitizedQuestion.length < 2) {
                return;
            }
            GoogleAnalyticEvents.navigation.submitQuestion('personal');
            submitQuestion(sanitizedQuestion);
        },
        [submitQuestion],
    );
    const submitRandomQuestion = React.useCallback(() => {
        const sanitizedQuestion = generateRandomQuestion();
        GoogleAnalyticEvents.navigation.submitQuestion('random');
        submitQuestion(sanitizedQuestion);
    }, [submitQuestion]);

    return (
        <form
            id="go-form"
            onSubmit={(ev) => {
                submitPersonalQuestion(state.question);
                ev.preventDefault();
            }}
        >
            <p className="question-intro">Twijfel je tussen Ja of Nee?</p>
            <p className="question-intro">Denk niet verder maar laat onze goudvis voor je kiezen!</p>
            <div className="line vspace">
                <input
                    className="text-input"
                    type="text"
                    id="question-field"
                    name="question"
                    placeholder="Ga ik ... Ja of Nee?"
                    value={state.question}
                    onChange={(ev) => setState((c) => ({ ...c, question: ev.target.value }))}
                />
                <Button
                    primary
                    className="go"
                    onClick={() => {
                        submitPersonalQuestion(state.question);
                    }}
                >
                    {'>>'}
                </Button>
            </div>
            <p className="question-intro">Of... Stel een random vraag</p>
            <div className="line vspace">
                <Button onClick={submitRandomQuestion}>Verras me</Button>
            </div>
        </form>
    );
}
