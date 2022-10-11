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
    console.log(screens)
    screens[name].style.display = 'block'
}

function newState(newState) {
    switch (newState.state) {
        case "Question":
            showScreen("question");
        break;
        case "Feeding":
            showScreen("feeding")
    }
    applicationState = newState;
}

function onAskQuestion() {
    const question = document.getElementById('question-field').value;

    newState({state:"Feeding", question});

}

function onVideoReady() {
    if (state.state !== 'Feeding') { 
        return;
    }

    newState({state:'Answer'})
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('Loaded')
    document.getElementById("go-button").addEventListener('click', onAskQuestion)
    document.getElementById("video-answer").addEventListener('loadeddata', onVideoReady)

    for (const screen of document.getElementsByTagName("screen")){
        screens[screen.id] = screen;
        screen.hidden = true;
    }
    setupBubblesAnimation();
    newState({state:"Question"});
})