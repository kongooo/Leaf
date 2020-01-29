function GetDayPercent() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let deg = (hour * 60 + minute) / 1440;
    return deg;
}

function UpdateSun() {
    let deg = GetDayPercent() * Math.PI * 2;
    let x = center_x + sun_r * Math.sin(deg);
    let y = center_y + sun_r * Math.cos(deg);
    SetPos(sun, x, y);
}

function UpdateMoon() {
    let deg = GetDayPercent() * Math.PI * 2;
    let x = center_x - sun_r * Math.sin(deg);
    let y = center_y - sun_r * Math.cos(deg);
    SetPos(moon_canvas, x, y);
}

function GetPercent() {
    stt_count += my_leaf.speed;
    stt_count = stt_count < 0 ? 0 : stt_count;
    stt_count = stt_count > 100 ? 100 : stt_count;
    return stt_count / 100;
}

function LeafMove() {
    if (leaf_draw) {
        ctx.clearRect(0, 0, leaf_canvas.width, leaf_canvas.height);
        my_leaf.draw();
        //my_leaf.DrawPath();
        let percent = GetPercent();
        // console.log(percent);
        if (percent == 1) {
            move = false;
            log = false;
            leaf_draw = false;
        }
        top_left = lerp(temp_left, left_end, percent);
        top_right = lerp(temp_right, right_end, percent);
        my_leaf.UpdatePoints();
        raf = window.requestAnimationFrame(LeafMove);
    }
}


function GetMouseVector(e) {
    if (count == 0)
        old_pos = new point(e.pageX, e.pageY);
    if (count == 1) {
        new_pos = new point(e.pageX, e.pageY);
        log = true;
        count = 0;
        return point_minus(new_pos, old_pos);
    }
    return null;
}

function GetEndPoint(center, dir, dis) {
    return new point(center.x + dir.x * dis, center.y + dir.y * dis);
}

function UpdateEndPos() {
    let dis = Math.sqrt(mouse_dir.x * mouse_dir.x + mouse_dir.y * mouse_dir.y);
    let unit_vector = new point(mouse_dir.x / dis, mouse_dir.y / dis);
    dis = dis > 100 ? 100 : dis;
    let distance = (dis / 100) * leaf_radius;
    left_end = GetEndPoint(left_center, unit_vector, distance);
    right_end = GetEndPoint(right_center, unit_vector, distance);
}


function GetV(day_color, bright, hsv_per) {
    let day_hsv = rgb2hsv(day_color);
    let per;
    if (bright)
        per = (GetDayPercent() - day_stt) / (day_end - day_stt) * (1 - hsv_per) + hsv_per;
    else
        per = 1 - (GetDayPercent() - night_stt) / (night_end - night_stt) * (1 - hsv_per);
    let v = day_hsv.c * per;
    return hsv2rgb(new color(day_hsv.a, day_hsv.b, v));
}


function ApplyDay(sky_color, ground_color, leaf_color, bodys_color, borders_color, e_color) {
    sky.style.backgroundColor = color2rgb(sky_color);
    ground.style.backgroundColor = color2rgb(ground_color);

    ctx.clearRect(0, 0, leaf_canvas.width, leaf_canvas.height);
    ctx.fillStyle = color2rgb(leaf_color);
    my_leaf.draw();

    UpdateCLColor(bodys_color, borders_color);
    eye_current = e_color;
    ChangeEyeColor(eye_current);
}

function GetCLColors(CL_colors, bright) {
    let temp = new Array(CL_colors.length);
    for (let i = 0; i < CL_colors.length; i++) {
        temp[i] = color2rgb(GetV(rgb2color(CL_colors[i]), bright, cl_dark_per));
    }
    return temp;
}

function GetEyeColor(e_color, bright) {
    return color2rgb(GetV(rgb2color(e_color), bright, cl_dark_per));
}

function ChangeDay() {
    let per = GetDayPercent();
    if (per <= day_stt)
        ApplyDay(sky_dark, ground_dark, leaf_dark, body_dark_color, border_dark_color, eye_dark_color);
    else if (per < day_end) {
        let sky_c = GetV(sky_bright, true, sky_per),
            ground_c = GetV(ground_bright, true, sky_per),
            leaf_c = GetV(leaf_bright, true, leaf_per),
            body_color_c = GetCLColors(body_color, true),
            border_color_c = GetCLColors(border_color, true),
            eye_c = GetEyeColor(eye_color, true);
        ApplyDay(sky_c, ground_c, leaf_c, body_color_c, border_color_c, eye_c);
    } else if (per <= night_stt) {
        ApplyDay(sky_bright, ground_bright, leaf_bright, body_color, border_color, eye_color);
    } else if (per < night_end) {
        let sky_c = GetV(sky_bright, false, sky_per),
            ground_c = GetV(ground_bright, false, sky_per),
            leaf_c = GetV(leaf_bright, false, leaf_per),
            body_color_c = GetCLColors(body_color, false),
            border_color_c = GetCLColors(border_color, false);
        eye_c = GetEyeColor(eye_color, false);
        ApplyDay(sky_c, ground_c, leaf_c, body_color_c, border_color_c, eye_c);
    } else
        ApplyDay(sky_dark, ground_dark, leaf_dark, body_dark_color, border_dark_color, eye_dark_color);
}