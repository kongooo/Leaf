let anima = document.querySelector('.load-anima');

window.onload = function() {
    anima.classList.add('anima-opacity');
    setTimeout("dis()", 1000);
}

function dis() {
    anima.style.display = "none";
}