import './styles.css';

let reviews;
let slideIndex = 0;

function loadStars(stars) {
    const calculatedStars = [];
    for (let i = 0; i < Math.floor(stars); i++) {
        calculatedStars.push(`<img src='img/full-star.svg'>`);
    }
    if (stars === 5) {
        return calculatedStars.map((item) => item).join('');
    }
    if (Number.isInteger(stars)) {
        for (let i = 0; i < 5 - stars; i++) {
            calculatedStars.push(`<img src='img/empty-star.svg'>`);
        }
    } else {
        calculatedStars.push(`<img src='img/half-star.svg'>`);
        for (let i = 0; i < 4 - Math.floor(stars); i++) {
            calculatedStars.push(`<img src='img/empty-star.svg'>`);
        }
    }
    return calculatedStars.map((item) => item).join('');
}

function loadReviews(review) {
    return `
    <div class="review">
        <div class="review-headshot">
            <img src="${review.headshot}" alt="${review.name}">
        </div>
        <p class="review-name"><strong>${review.name}</strong></p>
        <p class="review-location">${review.location}</p>
        <div class="review-stars">${loadStars(review.stars)}</div>
        <p class="review-body">${review.body}</p>
    </div>
    `;
}

function moveSlider(e) {
    if (e.currentTarget.id.includes('right')) {
        slideIndex === reviews.length - 1 ? (slideIndex = 0) : slideIndex++;
    } else {
        slideIndex === 0 ? (slideIndex = reviews.length - 1) : slideIndex--;
    }
    document.querySelector('.reviews').style.transform = `translate(${-100 * slideIndex}%)`;
}

// Fetching Data from our API - JSON file
async function fetchReviews() {
    await fetch('reviews.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was NOT ok');
            }
            return response.json();
        })
        .then((data) => {
            reviews = data;
            // Parse the data and create 'review' divs
            document.querySelector('.reviews').innerHTML = data.map(loadReviews).join('');
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation: ', error);
        });
}

fetchReviews();

// Add event listeners to move the slider left and right

document.querySelector('#arrow-right').addEventListener('click', moveSlider);
document.querySelector('#arrow-left').addEventListener('click', moveSlider);


// Light/Dark Mode Switch

const themeBtn = document.querySelector('.theme');

function getCurrentTheme() {
    let theme = window.matchMedia('(prefers-color-scheme: dark')
        .matches ? 'dark' : 'light';
    localStorage.getItem('LightDark.theme') ? theme =
        localStorage.getItem('LightDark.theme') : null;
    return theme;
}

function loadTheme(theme) {
    const root = document.querySelector(':root');
    if (theme === "light") {
        themeBtn.innerHTML = `<img src="img/moon.svg" alt="switch to dark theme">`;
    } else {
        themeBtn.innerHTML = `<img src="img/sun.svg" alt="switch to light theme">`;
    }
    root.setAttribute('color-scheme', `${theme}`);
}

themeBtn.addEventListener('click', () => {
    let theme = getCurrentTheme();
    let audio;
    if (theme === 'dark') {
        audio = document.querySelector('.theme-audio-light-on');
        theme = 'light';
    } else {
        audio = document.querySelector('.theme-audio-light-off');
        theme = 'dark';
    }
    audio.currentTime = 0;
    audio.play();
    localStorage.setItem('LightDark.theme', `${theme}`);
    loadTheme(theme);
})

window.addEventListener('DOMContentLoaded', () => {
    loadTheme(getCurrentTheme());
})


