let cloud_parent = document.querySelector('.cloud-parent');
let cloud_feshadow = document.querySelector('#cloud-shadow').firstChild;

let cloud_filter = 'url(#cloud-shadow)',
    cloud_max_count = 10,
    cloud_min_count = 5,
    cloud_data = new Array(3),
    cloud_scale_min = 3,
    cloud_scale_max = 10,
    cloud_rotate_min = -5,
    cloud_rotate_max = 15;

function initCloudData() {
    cloud_data[0] = 'M4.94,11.12C5.23,11.12 5.5,11.16 5.76,11.23C5.77,9.09 7.5,7.35 9.65,7.35C11.27,7.35 12.67,8.35 13.24,9.77C13.83,9 14.74,8.53 15.76,8.53C17.5,8.53 18.94,9.95 18.94,11.71C18.94,11.95 18.91,12.2 18.86,12.43C19.1,12.34 19.37,12.29 19.65,12.29C20.95,12.29 22,13.35 22,14.65C22,15.95 20.95,17 19.65,17C18.35,17 6.36,17 4.94,17C3.32,17 2,15.68 2,14.06C2,12.43 3.32,11.12 4.94,11.12Z';
    cloud_data[1] = 'M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z';
    cloud_data[2] = 'M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z';
}

function CreateCloudSVG() {
    let cloud_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let cloud_path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    cloud_path.setAttribute('fill', 'rgba(255, 255, 255, 1)');
    cloud_path.setAttribute('filter', cloud_filter);
    cloud_path.setAttribute('d', cloud_data[GetRandom(0, 3)]);
    cloud_svg.appendChild(cloud_path);
    return cloud_svg;
}

function CreateCloudDiv() {
    let cloud_div = document.createElement('div');
    cloud_div.classList.add('cloud');
    cloud_div.style.top = GetRandom(0, document.body.clientHeight * 0.65) + 'px';
    cloud_div.style.left = GetRandom(0, cloud_parent.clientWidth) + 'px';
    cloud_div.style.transform = 'rotate(' + GetRandom(cloud_rotate_min, cloud_rotate_max) + 'deg) scale(' + GetFloatRandom(cloud_scale_min, cloud_scale_max) + ')';
    cloud_div.appendChild(CreateCloudSVG());
    return cloud_div;
}

function CreateClouds() {
    initCloudData();
    let count = GetRandom(cloud_min_count, cloud_max_count);
    let clouds = new Array(count);
    for (let i = 0; i < count; i++) {
        clouds[i] = CreateCloudDiv();
        cloud_parent.appendChild(clouds[i]);
    }
    return clouds;
}

function GetCloudColor(bright, day_per) {
    let per;
    if (bright) {
        per = (day_per - day_stt) / (day_end - day_stt);
    } else {
        per = 1 - (day_per - night_stt) / (night_end - night_stt);
    }
    let temp = 255 * per;

    return 'rgba(' + temp + ', ' + temp + ',' + temp + ',' + per + ')';
}

function SetCloudColor(i, c) {
    clouds[i].firstChild.firstChild.setAttribute('fill', c);
}

function UpdateCloudColor(bright, day_per) {
    let current_color = GetCloudColor(bright, day_per);
    for (let i = 0; i < cloud_count; i++) {
        clouds[i].firstChild.firstChild.setAttribute('fill', current_color);
        cloud_feshadow.floodColor = current_color;
    }
}

function SetCloudTransparent() {
    for (let i = 0; i < cloud_count; i++) {
        SetCloudColor(i, 'transparent');
    }
}

function SetCloudWhite() {
    for (let i = 0; i < cloud_count; i++) {
        SetCloudColor(i, 'rgba(255,255,255,1)');
    }
}

let clouds = CreateClouds();
let cloud_count = clouds.length;