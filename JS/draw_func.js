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

function SetDayDarkColor() {
    sky_c = sky_dark;
    ground_c = ground_dark;
    leaf_c = leaf_dark;
    eye_c = eye_dark_color;
}

function SetDayBrightColor() {
    sky_c = sky_bright;
    ground_c = ground_bright;
    leaf_c = leaf_bright;
    eye_c = eye_color;
}

let sky_c,
    ground_c,
    leaf_c,
    eye_c;

let dark = false,
    bright = false;

function ChangeDay(per) {
    if (per < day_stt || per > night_end) {
        if (!dark) {
            SetDayDarkColor();
            ApplyDay(sky_c, ground_c, leaf_c, eye_c);
            SetCloudTransparent();
            SetCLDrakColor();
            dark = true;
        }
    } else if (per <= day_end) {

        sky_c = GetV(sky_bright, true, sky_per, per);
        ground_c = GetV(ground_bright, true, ground_per, per);
        leaf_c = GetV(leaf_bright, true, leaf_per, per);
        eye_c = color2rgb(GetV(rgb2color(eye_color), true, cl_dark_per, per));

        UpdateStarColor(true, per);
        UpdateCloudColor(true, per);
        UpdateCLColor(true, per);

        ApplyDay(sky_c, ground_c, leaf_c, eye_c);
    } else if (per < night_stt) {
        if (!bright) {
            SetDayBrightColor();
            ApplyDay(sky_c, ground_c, leaf_c, eye_c);
            SetStarTransparent();
            SetCloudWhite();
            SetCLBrightColor();
            bright = true;
        }
    } else if (per <= night_end) {

        sky_c = GetV(sky_bright, false, sky_per, per);
        ground_c = GetV(ground_bright, false, ground_per, per);
        leaf_c = GetV(leaf_bright, false, leaf_per, per);
        eye_c = color2rgb(GetV(rgb2color(eye_color), false, cl_dark_per, per));

        UpdateStarColor(false, per);
        UpdateCloudColor(false, per);
        UpdateCLColor(false, per);

        ApplyDay(sky_c, ground_c, leaf_c, eye_c);
    }

    UpdateMoon(per);
    UpdateSun(per);
}