import dialogInteractions from "./dialog.js";

dialogInteractions();

const wrapper = document.querySelector('.wrapper');
let isPositiveRotation = true;

wrapper.addEventListener('mouseleave', () => {
    isPositiveRotation = !isPositiveRotation;
    wrapper.style.transform = `rotate(${isPositiveRotation ? 1 : -1}deg) translateY(0)`;
});

wrapper.addEventListener('mouseenter', () => {
    wrapper.style.transform = '';
});

const likebtn = document.querySelector('.like');

async function updateLikes() {
    const res = await fetch('http://localhost:3000/likes');
    const data = await res.json();
    document.getElementById('like-count').innerText = data.likes;
}

likebtn.addEventListener('click', async (event) => {
    event.preventDefault();
    await fetch('http://localhost:3000/like', { method: 'POST' });
    updateLikes();
    likebtn.classList.add("active");
    setTimeout(() => likebtn.classList.remove("active"), 1000);
});

updateLikes();