let anima = document.querySelector('.load-anima'),
    temp_sun = document.querySelector(".sun-canvas"),
    cl_child = document.querySelector('#child');

window.onload = function() {
    disappear();
}

function SetNone() {
    anima.style.display = "none";
}

function SetFlex() {
    anima.style.display = "flex";
}

function disappear() {
    if (!anima.classList.contains('anima-opacity'))
        anima.classList.add('anima-opacity');
    if (anima.classList.contains('anima-show'))
        anima.classList.remove('anima-show');
    setTimeout("SetNone()", 1000);
}

function show() {
    SetFlex();
    if (anima.classList.contains('anima-opacity'))
        anima.classList.remove('anima-opacity');
    if (!anima.classList.contains('anima-show'))
        anima.classList.add('anima-show');
}

temp_sun.addEventListener('click', event => {
    show();
})

cl_child.addEventListener('click', event => {
    disappear();
})