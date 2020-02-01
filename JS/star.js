let stars_parent = document.querySelector('.star-parent');

let shadow_filter = 'url(#shadow)',
    star_color = 'rgba(250, 246, ',
    yellow_color_max = 150,
    yellow_color_min = 250,
    star_data = "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",
    star_min_count_small = 100,
    star_max_count_small = 110,
    star_min_count_big = 20,
    star_max_count_big = 30;

function CreateSVG() {
    let star_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let star_path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    star_path.setAttribute('fill', star_color + GetRandom(yellow_color_min, yellow_color_max) + ', 1)');
    star_path.setAttribute('filter', shadow_filter);
    star_path.setAttribute('d', star_data);
    star_svg.appendChild(star_path);
    return star_svg;
}

function GetFloatRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function CreateStarDiv(min_scale, max_scale) {
    let star_div = document.createElement('div');
    star_div.classList.add('star');
    star_div.style.top = GetRandom(0, document.body.clientHeight * 0.65) + 'px';
    star_div.style.left = GetRandom(0, stars_parent.clientWidth) + 'px';
    star_div.style.transform = 'rotate(' + GetRandom(0, 360) + 'deg) scale(' + GetFloatRandom(min_scale, max_scale) + ')';
    star_div.appendChild(CreateSVG());
    return star_div;
}

function CreateStar() {
    let count_small = GetRandom(star_min_count_small, star_max_count_small),
        count_big = GetRandom(star_min_count_big, star_max_count_big),
        count = count_big + count_small;
    let stars = new Array(count);
    for (let i = 0; i < count_small; i++) {
        stars[i] = CreateStarDiv(0.1, 0.3);
        stars_parent.appendChild(stars[i]);
    }
    for (let i = count_small; i < count; i++) {
        stars[i] = CreateStarDiv(0.3, 1);
        stars_parent.appendChild(stars[i]);
    }
    return stars;
}

function GetStarColor(i) {
    return (stars[i].firstChild.firstChild.getAttribute('fill'));
}

function SetStarColor(i, c) {
    stars[i].firstChild.firstChild.setAttribute('fill', c);
}

function UpdateRGBA(rgba, a) {
    let temp = rgba.split('(')[1];
    temp = temp.split(')')[0];
    temp = temp.split(',');
    return 'rgba(' + temp[0] + ', ' + temp[1] + ', ' + temp[2] + ', ' + a + ')';
}

function GetStarV(day_color, bright, day_per) {
    let per, a = 1;
    if (bright)
        per = 1 - (day_per - day_stt) / (day_end - day_stt);
    else
        per = (day_per - night_stt) / (night_end - night_stt);
    a *= per;
    return UpdateRGBA(day_color, a);
}

function initStarsColor() {
    let stars_color = new Array(star_count);
    for (let i = 0; i < star_count; i++) {
        stars_color[i] = GetStarColor(i);
    }
    return stars_color;
}

function UpdateStarColor(bright, day_per) {
    let temp_color;
    for (let i = 0; i < star_count; i++) {
        temp_color = GetStarV(star_colors[i], bright, day_per);
        SetStarColor(i, temp_color);
    }
}

function SetStarTransparent() {
    for (let i = 0; i < star_count; i++) {
        SetStarColor(i, 'transparent');
    }
}

let stars = CreateStar();
let star_count = stars.length;
let star_colors = initStarsColor();