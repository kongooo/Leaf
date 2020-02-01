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
        let percent = GetPercent();
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


function ApplyDay(sky_color, ground_color, leaf_color, e_color) {
    sky.style.backgroundColor = color2rgb(sky_color);
    ground.style.backgroundColor = color2rgb(ground_color);

    my_leaf.UpdateColor(leaf_color);

    eye_current = e_color;
    ChangeEyeColor(eye_current);
}

function GetEyeColor(e_color, bright, per) {
    return color2rgb(GetV(rgb2color(e_color), bright, cl_dark_per, per));
}

let sky_c,
    ground_c,
    leaf_c,
    eye_c;

function ChangeDay(per) {
    let change = false;
    if (per <= day_stt) {
        sky_c = sky_dark;
        ground_c = ground_dark;
        leaf_c = leaf_dark;
        eye_c = eye_dark_color;
        ApplyDay(sky_c, ground_c, leaf_c, eye_c);
        SetCloudTransparent();
        SetCLDrakColor();
        change = false;
    } else if (per < day_end) {
        sky_c = GetV(sky_bright, true, sky_per, per);
        ground_c = GetV(ground_bright, true, ground_per, per);
        leaf_c = GetV(leaf_bright, true, leaf_per, per);
        eye_c = GetEyeColor(eye_color, true, per);
        UpdateStarColor(true, per);
        UpdateCloudColor(true, per);
        UpdateCLColor(true, per);
        change = true;
    } else if (per <= night_stt) {
        sky_c = sky_bright;
        ground_c = ground_bright;
        leaf_c = leaf_bright;
        eye_c = eye_color;
        ApplyDay(sky_c, ground_c, leaf_c, eye_c);
        SetStarTransparent();
        SetCloudWhite();
        SetCLBrightColor();
        change = false;
    } else if (per < night_end) {
        sky_c = GetV(sky_bright, false, sky_per, per);
        ground_c = GetV(ground_bright, false, ground_per, per);
        leaf_c = GetV(leaf_bright, false, leaf_per, per);
        eye_c = GetEyeColor(eye_color, false, per);
        UpdateStarColor(false, per);
        UpdateCloudColor(false, per);
        UpdateCLColor(false, per);
        change = true;
    } else {
        sky_c = sky_dark;
        ground_c = ground_dark;
        leaf_c = leaf_dark;
        body_color_c = body_dark_color;
        border_color_c = border_dark_color;
        eye_c = eye_dark_color;
        ApplyDay(sky_c, ground_c, leaf_c, eye_c)
        SetCloudTransparent();
        SetCLDrakColor();
        change = false;
    }

    if (change) {
        ApplyDay(sky_c, ground_c, leaf_c, eye_c);
    }

    UpdateMoon(per);
    UpdateSun(per);
}