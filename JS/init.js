let sun_radius = 40;

let center_x = document.body.clientWidth / 2;
let center_y = document.body.clientHeight / 2;
let sun_r = center_y;

let sun = document.querySelector(".sun-canvas");

let leaf_canvas = document.querySelector(".draw-canvas");

let move = false;
let raf;
let ctx = SetupCanvas(leaf_canvas);
ctx.fillStyle = this.color;

let left_end, right_end;
let x_displace = 0,
    y_displace = 50;
let top_left = new point(80 + x_displace, 8 + y_displace);
let top_right = new point(500 + x_displace, 180 + y_displace);
let left_center = top_left,
    right_center = top_right;

let stt_count = 0;
let temp_left, temp_right;
let count = 0;
let old_pos, new_pos, mouse_dir;
let log = false,
    leaf_draw = false;

let leaf_radius = 40;

let my_leaf = {

    points_0: new Array(top_left.x, top_left.y),
    points_1: new Array(5 + x_displace, 180 + y_displace, 5 + x_displace, 260 + y_displace, 250 + x_displace, 240 + y_displace),
    points_2: new Array(370 + x_displace, 300 + y_displace, 370 + x_displace, 280 + y_displace, top_right.x, top_right.y),
    points_3: new Array(350 + x_displace, 100 + y_displace, 350 + x_displace, 100 + y_displace, 270 + x_displace, 180 + y_displace),
    points_4: new Array(230 + x_displace, 60 + y_displace, 230 + x_displace, 60 + y_displace, top_left.x, top_left.y),
    points_5: new Array(247 + x_displace, 480 + y_displace, 257 + x_displace, 475 + y_displace, 267 + x_displace, 240 + y_displace),

    speed: 1,

    color: "rgb(73, 150, 162)",

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

let moon_canvas = document.querySelector(".moon");
let moon_ctx = SetupCanvas(moon_canvas);
let moon_center1 = new point(0, 50),
    moon_center2 = new point(50, 50);

let moon = {
    color: "rgb(255, 252, 174)",
    moon_radius1: 50,
    moon_radius2: 50,

    draw: function() {
        let moon_path = new Path2D();
        moon_path.arc(moon_center1.x, moon_center1.y, this.moon_radius1, angle2deg(-60), angle2deg(60), false);
        moon_path.arc(moon_center2.x, moon_center2.y, this.moon_radius2, angle2deg(120), angle2deg(-120), true);
        moon_ctx.translate(-10, 30);
        moon_ctx.rotate(angle2deg(-15));
        moon_ctx.shadowBlur = 15;
        moon_ctx.shadowColor = this.color;
        moon_ctx.fillStyle = this.color;
        moon_ctx.fill(moon_path);
    }
}

let day_stt = 4 / 24,
    day_end = 9 / 24,
    night_stt = 16 / 24,
    night_end = 20 / 24,
    sky_per = 0.2,
    leaf_per = 0.3;

let sky_bright = new color(214, 250, 255),
    ground_bright = new color(247, 237, 229),
    leaf_bright = new color(73, 150, 162),
    sky_dark = GetDarkColor(sky_bright, sky_per),
    ground_dark = GetDarkColor(ground_bright, sky_per),
    leaf_dark = GetDarkColor(leaf_bright, leaf_per);

let sky = document.body,
    ground = document.querySelector(".ground");

function initLeafAndGround() {
    leaf_canvas.style.left = (document.body.clientWidth - leaf_canvas.clientWidth) / 2 + "px";
    leaf_canvas.style.top = (document.body.clientHeight - leaf_canvas.clientHeight) / 2 + "px";

    ground.style.height = (document.body.clientHeight) * 0.5 + "px";
    ground.style.top = (document.body.clientHeight) * 0.6 + "px";
}

initLeafAndGround();