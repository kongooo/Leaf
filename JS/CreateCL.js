let min_count = 5,
    max_count = 20;
let cl_body_colors = new Array(10),
    cl_borer_colors = new Array(10);

function initBodyColors() {
    cl_body_colors[0] = "rgb(166,208,210)";
    cl_body_colors[1] = "rgb(246,220,224)";
    cl_body_colors[2] = "rgb(205,203,122)";
    cl_body_colors[3] = "rgb(188,167,145)";
    cl_body_colors[4] = "rgb(212,204,189)";
    cl_body_colors[5] = "rgb(228,240,246)";
    cl_body_colors[6] = "rgb(212,235,209)";
    cl_body_colors[7] = "rgb(137,229,198)";
    cl_body_colors[8] = "rgb(187,214,240)";
    cl_body_colors[9] = "rgb(252,206,180)";
}

function initBorderColors() {
    cl_borer_colors[0] = "rgb(86,159,167)";
    cl_borer_colors[1] = "rgb(215,167,162)";
    cl_borer_colors[2] = "rgb(169,163,98)";
    cl_borer_colors[3] = "rgb(144,128,111)";
    cl_borer_colors[4] = "rgb(176,162,139)";
    cl_borer_colors[5] = "rgb(174,204,222)";
    cl_borer_colors[6] = "rgb(180,201,176)";
    cl_borer_colors[7] = "rgb(161,185,150)";
    cl_borer_colors[8] = "rgb(139,171,202)";
    cl_borer_colors[9] = "rgb(221,142,121)";
}

function GetRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function CreateCLDiv() {
    let cl_temp = document.createElement('div');
    let color_index = GetRandom(0, 10);
    cl_temp.classList.add('clannad');
    cl_temp.style.color = cl_body_colors[color_index];
    cl_temp.style.borderColor = cl_borer_colors[color_index];
    cl_temp.style.transform = "skewY(" + GetRandom(-5, 5) + "deg)";
    cl_temp.top = 0;
    cl_temp.left = 0;
    return cl_temp;
}

function CreateBody() {
    let body_temp = document.createElement('canvas');
    body_temp.width = 100;
    body_temp.height = 80;
    body_temp.classList.add('cl-body');
    return body_temp;
}

function CreateEye() {
    let eye_temp = document.createElement('canvas');
    eye_temp.width = 90;
    eye_temp.height = 70;
    eye_temp.classList.add('cl-eye');
    return eye_temp;
}


function RandomCL() {
    initBodyColors();
    initBorderColors();
    let count = GetRandom(min_count, max_count);
    let cl_node = new Array(count);
    for (let i = 0; i < count; i++) {
        cl_node[i] = CreateCLDiv();
        cl_node[i].appendChild(CreateBody());
        cl_node[i].appendChild(CreateEye());
        document.body.appendChild(cl_node[i]);
    }
}

RandomCL();