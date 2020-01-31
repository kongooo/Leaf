function GetDayPercent() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let deg = (hour * 60 + minute) / 1440;
    return deg;
}

function UpdateSun(per) {
    let deg = per * Math.PI * 2;
    let x = center_x + sun_r * Math.sin(deg);
    let y = center_y + sun_r * Math.cos(deg);
    SetPos(sun, x, y);
}

function UpdateMoon(per) {
    let deg = per * Math.PI * 2;
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

function GetCLColors(CL_colors, bright, per) {
    let temp = new Array(CL_colors.length);
    for (let i = 0; i < CL_colors.length; i++) {
        temp[i] = color2rgb(GetV(rgb2color(CL_colors[i]), bright, cl_dark_per, per));
    }
    return temp;
}

function GetEyeColor(e_color, bright, per) {
    return color2rgb(GetV(rgb2color(e_color), bright, cl_dark_per, per));
}

let sky_c,
    ground_c,
    leaf_c,
    body_color_c,
    border_color_c,
    eye_c;

function ChangeDay(per) {
    if (per <= day_stt) {
        sky_c = sky_dark;
        ground_c = ground_dark;
        leaf_c = leaf_dark;
        body_color_c = body_dark_color;
        border_color_c = border_dark_color;
        eye_c = eye_dark_color;
    } else if (per < day_end) {
        sky_c = GetV(sky_bright, true, sky_per, per);
        ground_c = GetV(ground_bright, true, sky_per, per);
        leaf_c = GetV(leaf_bright, true, leaf_per, per);
        body_color_c = GetCLColors(body_color, true, per);
        border_color_c = GetCLColors(border_color, true, per);
        eye_c = GetEyeColor(eye_color, true, per);
    } else if (per <= night_stt) {
        sky_c = sky_bright;
        ground_c = ground_bright;
        leaf_c = leaf_bright;
        body_color_c = body_color;
        border_color_c = border_color;
        eye_c = eye_color;
    } else if (per < night_end) {
        sky_c = GetV(sky_bright, false, sky_per, per);
        ground_c = GetV(ground_bright, false, sky_per, per);
        leaf_c = GetV(leaf_bright, false, leaf_per, per);
        body_color_c = GetCLColors(body_color, false, per);
        border_color_c = GetCLColors(border_color, false, per);
        eye_c = GetEyeColor(eye_color, false, per);
    } else {
        sky_c = sky_dark;
        ground_c = ground_dark;
        leaf_c = leaf_dark;
        body_color_c = body_dark_color;
        border_color_c = border_dark_color;
        eye_c = eye_dark_color;
    }

    ApplyDay(sky_c, ground_c, leaf_c, body_color_c, border_color_c, eye_c);
    UpdateMoon(per);
    UpdateSun(per);
}