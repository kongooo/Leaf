function SetupCanvas(canvas) {
    let dpr = window.devicePixelRatio;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    return ctx;
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


let leaf_canvas = document.querySelector(".draw-canvas");
let move = false;
let raf;
let ctx = SetupCanvas(leaf_canvas);
class point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
let left_end, right_end;
let x_displace = 0,
    y_displace = 50;
let top_left = new point(80 + x_displace, 8 + y_displace);
let top_right = new point(500 + x_displace, 180 + y_displace);
let left_center = top_left,
    right_center = top_right;

let leaf_radius = 40;
let my_leaf = {

    points_0: new Array(top_left.x, top_left.y),
    points_1: new Array(5 + x_displace, 180 + y_displace, 5 + x_displace, 260 + y_displace, 250 + x_displace, 240 + y_displace),
    points_2: new Array(370 + x_displace, 300 + y_displace, 370 + x_displace, 280 + y_displace, top_right.x, top_right.y),
    points_3: new Array(350 + x_displace, 100 + y_displace, 350 + x_displace, 100 + y_displace, 270 + x_displace, 180 + y_displace),
    points_4: new Array(230 + x_displace, 60 + y_displace, 230 + x_displace, 60 + y_displace, top_left.x, top_left.y),
    points_5: new Array(247 + x_displace, 480 + y_displace, 257 + x_displace, 475 + y_displace, 267 + x_displace, 240 + y_displace),

    speed: 1,

    color: "rgb(82, 159, 170)",

    DrawLeaf: function(path, leaf) {
        index = 0;
        leaf.bezierCurveTo(path[index++], path[index++], path[index++], path[index++], path[index++], path[index++]);
    },

    UpdatePoints: function() {
        this.points_0[0] = top_left.x;
        this.points_0[1] = top_left.y;
        this.points_4[4] = top_left.x;
        this.points_4[5] = top_left.y;
        this.points_2[4] = top_right.x;
        this.points_2[5] = top_right.y;
    },

    draw: function() {
        leaf = new Path2D();
        leaf.moveTo(this.points_0[0], this.points_0[1]);
        this.DrawLeaf(this.points_1, leaf);
        leaf.lineTo(this.points_5[0], this.points_5[1]);
        leaf.lineTo(this.points_5[2], this.points_5[3]);
        leaf.lineTo(this.points_5[4], this.points_5[5]);
        this.DrawLeaf(this.points_2, leaf);
        this.DrawLeaf(this.points_3, leaf);
        this.DrawLeaf(this.points_4, leaf);

        ctx.fillStyle = this.color;
        ctx.fill(leaf);
    },

    DrawCircles: function(path) {
        let radius = 5;
        for (let i = 0; i < path.length; i += 2) {
            let circles = new Path2D();
            circles.moveTo(path[i] + radius, path[i + 1]);
            circles.arc(path[i], path[i + 1], radius, 0, Math.PI * 2, true);
            ctx.stroke(circles);
        }
    },

    DrawPath: function(path) {
        this.DrawCircles(this.points_0);
        this.DrawCircles(this.points_1);
        this.DrawCircles(this.points_2);
        this.DrawCircles(this.points_3);
        this.DrawCircles(this.points_4);
        this.DrawCircles(this.points_5);
    }
}

function lerp(stt, end, percent) {
    let x = stt.x + (end.x - stt.x) * percent;
    let y = stt.y + (end.y - stt.y) * percent;
    return new point(x, y);
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

my_leaf.draw();
//my_leaf.DrawPath();
let stt_count = 0;
let temp_left, temp_right;
let count = 0;
let old_pos, new_pos, mouse_dir;
let log = false,
    leaf_draw = false;

function point_minus(a, b) {
    return new point(a.x - b.x, a.y - b.y);
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

leaf_canvas.addEventListener('mousemove', event => {
    if (!log) {
        mouse_dir = GetMouseVector(event);
        if (log) {
            UpdateEndPos();
            if (!move) {
                leaf_draw = true;
                stt_count = 0;
                temp_left = top_left;
                temp_right = top_right;
                raf = window.requestAnimationFrame(LeafMove);
                move = true;
            }
        }
        // console.log(mouse_dir);
        count++;
    }
})

let ground = document.querySelector(".ground");
let sun_radius = 40;

let center_x = document.body.clientWidth / 2 - sun_radius;
let center_y = document.body.clientHeight * 0.55 + 85 + Math.tan(5 * Math.PI / 180) * (document.body.clientWidth / 2);
let sun_r = center_y;

let sun = document.querySelector(".sun-canvas");
UpdateSun();
setInterval(UpdateSun, 60000);