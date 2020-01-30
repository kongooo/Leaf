let min_count = 5,
    max_count = 30;
let cl_body_colors = new Array(10),
    cl_borer_colors = new Array(10);

let body_center = new point(55, 55),
    body_radius = 50,
    stt_deg = angle2deg(0),
    end_deg = angle2deg(180),
    offset = 20,
    second_offset = 8,
    third_offset = 20,
    vertical_offset = 5,
    cl_dark_per = 0.3,

    eye_offset = 7,
    eye_v_offset = 20,
    eye_length = 17,
    eye_color = "rgb(77,77,77)",
    eye_dark_color,
    eye_current,
    eye_radius = 20,
    eye_vertical = 15;

function initBodyColors() {
    cl_body_colors[0] = "rgb(166,208,210)";
    cl_body_colors[1] = "rgb(246,220,224)";
    cl_body_colors[2] = "rgb(205,203,122)";
    cl_body_colors[3] = "rgb(188,167,145)";
    cl_body_colors[4] = "rgb(212,204,189)";
    cl_body_colors[5] = "rgb(228,240,246)";
    cl_body_colors[6] = "rgb(212,235,209)";
    cl_body_colors[7] = "rgb(210,227,196)";
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
    cl_borer_colors[7] = "rgb(139,160,109)";
    cl_borer_colors[8] = "rgb(139,171,202)";
    cl_borer_colors[9] = "rgb(221,142,121)";
}

function GetRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

let left_pos, right_pos;

function initPos() {
    let temp = (document.body.clientWidth / 2) * Math.tan(angle2deg(5));
    left_pos = new point(0, document.body.clientHeight / 2 + temp);
    right_pos = new point(document.body.clientWidth - 100, document.body.clientHeight / 2 - temp);
}

function judgePos(p) {
    let c = left_pos.y,
        a = document.body.clientWidth,
        b = right_pos.y;

    if (p.x > left_pos.x && p.x < right_pos.x && p.y < document.body.clientHeight - 100 && (b - c) * p.x < a * (p.y - c))
        return true;
    else
        return false;
}

function GetRandomePos() {
    return new point(GetRandom(0, document.body.clientWidth - 100), GetRandom(right_pos.y, document.body.clientHeight - 100));
}

function GetNewPos() {
    let random_pos = GetRandomePos();
    while (judgePos(random_pos) == false) {
        random_pos = GetRandomePos();
    }
    return random_pos;
}

function CreateCLDiv() {
    let cl_temp = document.createElement('div');
    let color_index = GetRandom(0, 10);
    cl_temp.classList.add('clannad');
    cl_temp.style.color = cl_body_colors[color_index];
    cl_temp.style.borderColor = cl_borer_colors[color_index];
    cl_temp.style.transform = "skewY(" + GetRandom(-5, 5) + "deg)";
    let temp_pos = GetNewPos();
    cl_temp.style.top = temp_pos.y + 30 + "px";
    cl_temp.style.left = temp_pos.x + "px";
    let cl_pos_y = temp_pos.y + 30 + (body_center.y + offset) / window.devicePixelRatio,
        leaf_pos_y = (document.body.clientHeight - leaf_canvas.clientHeight) / 2 + (leaf_height + y_displace) / window.devicePixelRatio;
    if (cl_pos_y >= leaf_pos_y)
        cl_temp.style.zIndex = 3;
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
    initPos();
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