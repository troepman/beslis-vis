function setupBubblesAnimation(){
    const bubbles = Array.from(document.getElementsByClassName("bubble"));
    function generateState(i, init=false) {
        const paddingWidth = 50;
        const contentWidth = window.innerWidth - 2 * paddingWidth
        return [
            paddingWidth + (i + Math.random()) * (contentWidth / bubbles.length), 
            (init?Math.random():1) * window.innerHeight, 
            Math.random() * 50 + 50
        ];
    }
    const states = bubbles.map((_, i) =>  generateState(i, true))
    function animate() {
        bubbles.forEach((bubble, i) => {
            const state = states[i]
            state[1] -= 1;
            if (state[1] < -100) {
                const n = generateState(i);
                state[0] = n[0]
                state[1] = n[1];
            }
            bubble.style.top = state[1] + "px";
            bubble.style.left = (state[0] - state[2] / 2) + "px";
            bubble.style.width = bubble.style.height = state[2] + "px";
        });

        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}



let applicationState = {
    state: "Question",
    question: null,
    videoFragment: null,
}

const screens = {}

function showScreen(name){
    for (const screenName in screens){
        const screen = screens[screenName];
        screen.style.display = 'none';
    }
    screens[name].style.display = '';
}

function newState(newState) {
    switch (newState.state) {
        case "Question":
            showScreen("question");
        break;
        case "Feeding":
            showScreen("feeding");
            setTimeout(() => {
                document.getElementById('video-answer').src = newState.videoFragment
                document.getElementById('video-answer').load();
            }, 6000);
            startSearchAnimation()
        break;
        case "Answer":
            stopSearchAnimation();
            showScreen("answer");
        break;

    }
    applicationState = newState;
}

function formatQuestion(q){
    if (!q.endsWith('?')){
        q += '?'
    }
    return q;
}

function onAskQuestion() {
    const question = formatQuestion(document.getElementById('question-field').value);
    
    index = Math.round(Math.random() * 118);
    newState({state:"Feeding", question, videoFragment: `fragments/fragment${index}.mp4`});
}

function onVideoReady() {
    if (applicationState.state !== 'Feeding') { 
        return;
    }
    document.getElementById('video-answer').play();
    document.getElementById('video-answer-question').innerText = applicationState.question;

    newState({state:'Answer', question: applicationState.question, videoFragment: applicationState.videoFragment})
}

function parseUrl(){
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    const result = {}
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        
    }

    return result;
}

const searchSpans = {};

const searchAnimation = {
    [0]: () => {
        searchSpans['s1'].style.opacity = 1;
        searchSpans['s2'].style.opacity = 0;
        searchSpans['s3'].style.opacity = 0;
    },
    [2]: () => {
        searchSpans['s1'].style.opacity = 0;
        searchSpans['s2'].style.opacity = 1;
        searchSpans['s3'].style.opacity = 0;
    },
    [4]: () => {
        searchSpans['s1'].style.opacity = 0;
        searchSpans['s2'].style.opacity = 0;
        searchSpans['s3'].style.opacity = 1;
    }
}
let searchAnimationStart = 0;
let searchAnimationHandle;
function searchAnimationRunner() {
    const duration = (Date.now() - searchAnimationStart) / 1000;
    const key = Object.keys(searchAnimation).reduce((best, timestamp) => timestamp <= duration ? timestamp : best, undefined)
    if (key){
        searchAnimation[key]();
    }

    if (duration > 6){
        searchAnimationStart = Date.now();
    }
    searchAnimationHandle = requestAnimationFrame(searchAnimationRunner)
}

function startSearchAnimation(){
    searchAnimationStart = Date.now()
    searchAnimationRunner();
}
function stopSearchAnimation() {
    if (searchAnimationHandle){
        cancelAnimationFrame(searchAnimationHandle);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("go-button").addEventListener('click', onAskQuestion)
    document.getElementById("video-answer").addEventListener('loadeddata', onVideoReady)

    for (const screen of document.getElementsByTagName("screen")){
        screens[screen.id] = screen;
        screen.hidden = true;
    }

    for (const searchSpan of document.getElementsByClassName("search")){
        searchSpans[searchSpan.id] = searchSpan;
    }

    setupBubblesAnimation();

    const query = parseUrl()
    if ('q' in query){
        const index = Math.round(Math.random() * 118);
        const fragment = query['a'] ?? `fragment${index}`
        
        newState({state:"Feeding", question: formatQuestion(query['q']), videoFragment: `fragments/${fragment}.mp4`});
    } else {
        newState({state:"Question"});
    }
})