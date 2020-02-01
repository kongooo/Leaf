let cl_bodys = document.querySelectorAll(".cl-body"),
    cl_eyes = document.querySelectorAll(".cl-eye");

let cl_count = cl_bodys.length,
    cl_scale_max = 1.1,
    cl_scale_min = 0.6;

let clannads = new Array(cl_count),
    bodys_ctx = new Array(cl_count),
    eyes_ctx = new Array(cl_count),
    body_color = new Array(cl_count),
    border_color = new Array(cl_count),
    center_pos = new Array(cl_count),
    eye_center = new Array(cl_count),
    body_dark_color = new Array(cl_count),
    border_dark_color = new Array(cl_count);

function CalculateDarkColors(i) {
    let temp_hsv = rgb2hsv(rgb2color(body_color[i]));
    temp_hsv.c *= cl_dark_per;
    body_dark_color[i] = color2rgb(hsv2rgb(temp_hsv));

    temp_hsv = rgb2hsv(rgb2color(border_color[i]));
    temp_hsv.c *= cl_dark_per;
    border_dark_color[i] = color2rgb(hsv2rgb(temp_hsv));
}

function CalculateEyeDark() {
    let temp_hsv = rgb2hsv(rgb2color(eye_color));
    temp_hsv.c *= cl_dark_per;
    eye_dark_color = color2rgb(hsv2rgb(temp_hsv));
}

function init() {
    for (let i = 0; i < cl_count; i++) {
        clannads[i] = cl_bodys[i].parentNode;
        bodys_ctx[i] = SetupCanvas(cl_bodys[i]);
        eyes_ctx[i] = SetupCanvas(cl_eyes[i]);
        body_color[i] = clannads[i].style.color;
        eye_center[i] = new point(55, 55);
        border_color[i] = clannads[i].style.borderColor;
        center_pos[i] = new point(parseInt(clannads[i].style.left) + body_center.x / window.devicePixelRatio, parseInt(clannads[i].style.top) + body_center.y / window.devicePixelRatio);
        SetScale(i);
        CalculateEyeDark();
        CalculateDarkColors(i);
    }
}

function GetV(day_color, bright, hsv_per, day_per) {
    let day_hsv = rgb2hsv(day_color);
    let per;
    if (bright)
        per = (day_per - day_stt) / (day_end - day_stt) * (1 - hsv_per) + hsv_per;
    else
        per = 1 - (day_per - night_stt) / (night_end - night_stt) * (1 - hsv_per);
    let v = day_hsv.c * per;
    return hsv2rgb(new color(day_hsv.a, day_hsv.b, v));
}

function SetScale(i) {
    let temp_scale = Math.random() * (cl_scale_max - cl_scale_min) + cl_scale_min;
    bodys_ctx[i].scale(temp_scale, temp_scale);
    eyes_ctx[i].scale(temp_scale, temp_scale);
}

function GetCLColor(color, bright, per) {

    return color2rgb(GetV(rgb2color(color), bright, cl_dark_per, per));
}

function UpdateCLColor(bright, per) {
    for (let i = 0; i < cl_count; i++) {
        bodys_ctx[i].strokeStyle = GetCLColor(border_color[i], bright, per);
        bodys_ctx[i].fillStyle = GetCLColor(body_color[i], bright, per);
        bodys_ctx[i].fill("evenodd");
        bodys_ctx[i].stroke();
    }
}

function SetCLDrakColor() {
    for (let i = 0; i < cl_count; i++) {
        bodys_ctx[i].strokeStyle = border_dark_color[i];
        bodys_ctx[i].fillStyle = body_dark_color[i];
        bodys_ctx[i].fill("evenodd");
        bodys_ctx[i].stroke();
    }
}

function SetCLBrightColor() {
    for (let i = 0; i < cl_count; i++) {
        bodys_ctx[i].strokeStyle = border_color[i];
        bodys_ctx[i].fillStyle = body_color[i];
        bodys_ctx[i].fill("evenodd");
        bodys_ctx[i].stroke();
    }
}


function DrawBody() {
    for (let i = 0; i < cl_count; i++) {
        bodys_ctx[i].beginPath();
        bodys_ctx[i].arc(body_center.x, body_center.y, body_radius, stt_deg, end_deg, true);
        bodys_ctx[i].bezierCurveTo(body_center.x - body_radius, body_center.y + offset - vertical_offset, body_center.x - body_radius + second_offset, body_center.y + offset, body_center.x - body_radius + third_offset, body_center.y + offset);
        bodys_ctx[i].lineTo(body_center.x + body_radius - third_offset, body_center.y + offset);
        bodys_ctx[i].bezierCurveTo(body_center.x + body_radius - second_offset, body_center.y + offset, body_center.x + body_radius, body_center.y + offset - vertical_offset, body_center.x + body_radius, body_center.y);
        bodys_ctx[i].lineWidth = 3;
        bodys_ctx[i].closePath();
        bodys_ctx[i].lineJoin = 'round';
        DrawEye(i);
    }

    ChangeEyeColor(eye_color);
}

function DrawEye(i) {
    eyes_ctx[i].beginPath();
    eyes_ctx[i].moveTo(eye_center[i].x - eye_offset, eye_center[i].y - eye_v_offset);
    eyes_ctx[i].lineTo(eye_center[i].x - eye_offset, eye_center[i].y - eye_v_offset + eye_length);
    eyes_ctx[i].moveTo(eye_center[i].x + eye_offset, eye_center[i].y - eye_v_offset);
    eyes_ctx[i].lineTo(eye_center[i].x + eye_offset, eye_center[i].y - eye_v_offset + eye_length);
    eyes_ctx[i].lineWidth = 3;
    eyes_ctx[i].lineCap = 'round';
}

function ChangeEyeColor(c) {
    for (let i = 0; i < cl_count; i++) {
        eyes_ctx[i].strokeStyle = c;
        eyes_ctx[i].stroke();
    }
}

function GetEyePos(i, mouse_pos) {
    let minus_vector = point_minus(mouse_pos, center_pos[i]);
    let len = Math.sqrt(minus_vector.x * minus_vector.x + minus_vector.y * minus_vector.y);
    let result;
    if (len <= eye_radius)
        result = World2Eye(mouse_pos, i);
    else {
        let temp_vector = new point(minus_vector.x / len, minus_vector.y / len);
        result = World2Eye(new point(center_pos[i].x + eye_radius * temp_vector.x, center_pos[i].y + eye_radius * temp_vector.y), i);
    }
    if (result.y < body_center.y - eye_vertical)
        result.y = body_center.y - eye_vertical;
    else if (result.y > body_center.y + eye_vertical)
        result.y = body_center.y + eye_vertical;
    return result;
}

function World2Eye(world_pos, i) {
    return new point((world_pos.x - parseInt(clannads[i].style.left)) * window.devicePixelRatio, (world_pos.y - parseInt(clannads[i].style.top)) * window.devicePixelRatio);
}

function ControlEyes() {
    for (let i = 0; i < cl_count; i++) {
        eyes_ctx[i].clearRect(0, 0, cl_eyes[i].width, cl_eyes[i].height);
        DrawEye(i);
        eye_center[i] = GetEyePos(i, new point(event.pageX, event.pageY));
    }
    ChangeEyeColor(eye_current);
}


let cl_move = false;

init();
DrawBody();
UpdateCLColor(body_color, border_color);


document.addEventListener('mousemove', event => {
    ControlEyes();
})