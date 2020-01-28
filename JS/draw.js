function SetupCanvas(canvas) {
    let dpr = window.devicePixelRatio;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    return ctx;
}

function DrawCircles(path) {
    for (let i = 0; i < path.length; i += 2) {
        let circles = new Path2D();
        circles.moveTo(path[i] + radius, path[i + 1]);
        circles.arc(path[i], path[i + 1], radius, 0, Math.PI * 2, true);
        ctx.stroke(circles);
    }
}

function DrawLeaf(path) {
    index = 0;
    leaf.bezierCurveTo(path[index++], path[index++], path[index++], path[index++], path[index++], path[index++]);
}

function SetSunPos(sun, x, y) {
    sun.style.left = x + "px";
    sun.style.top = y + "px";
}

function GetSunDeg() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let deg = (hour * 60 + minute) / 1440 * Math.PI * 2;
    return deg;
}

function UpdateSun() {
    let deg = GetSunDeg();
    let x = center_x + sun_r * Math.sin(deg);
    let y = center_y + sun_r * Math.cos(deg);
    SetSunPos(sun, x, y);
}

let ctx = SetupCanvas(document.querySelector(".draw-canvas"));
let points_1 = new Array(80, 5, 5, 180, 5, 260, 250, 240);
let points_2 = new Array(370, 300, 370, 280, 500, 180);
let points_3 = new Array(350, 100, 350, 100, 270, 180);
let points_4 = new Array(230, 60, 230, 60, 80, 5);
let radius = 5;

let leaf = new Path2D();


let index = 0;
leaf.moveTo(points_1[index++], points_1[index++]);
leaf.bezierCurveTo(points_1[index++], points_1[index++], points_1[index++], points_1[index++], points_1[index++], points_1[index++]);
leaf.lineTo(247, 480);
leaf.lineTo(257, 475);
leaf.lineTo(267, 240);
DrawLeaf(points_2);
DrawLeaf(points_3);
DrawLeaf(points_4);


// DrawCircles(points_1);
// DrawCircles(points_2);
// DrawCircles(points_3);
// DrawCircles(points_4);

ctx.fillStyle = "rgb(82, 159, 170)";
ctx.fill(leaf);

let ground = document.querySelector(".ground");
let sun_radius = 40;

let center_x = document.body.clientWidth / 2 - sun_radius;
let center_y = document.body.clientHeight * 0.55 + 85 + Math.tan(5 * Math.PI / 180) * (document.body.clientWidth / 2);
let sun_r = center_y;

let sun = document.querySelector(".sun-canvas");
UpdateSun();
setInterval(UpdateSun, 60000);