class color {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function color2rgb(c) {
    return "rgb(" + c.a + "," + c.b + "," + c.c + ")";
}

function rgb2color(c) {
    let temp = c.split('(')[1];
    temp = temp.split(')')[0];
    temp = temp.split(',');
    return new color(parseInt(temp[0]), parseInt(temp[1]), parseInt(temp[2]));
}

function GetDarkColor(bright_color, per) {
    let temp = rgb2hsv(bright_color);
    temp.c *= per;
    return hsv2rgb(temp);
}

function PrintColor(color) {
    console.log(color.a, color.b, color.c);
}

function rgb2hsv(c) {
    let r = c.a,
        g = c.b,
        b = c.c;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, v;
    if (max == min)
        h = 0;
    else if (max == r && g >= b) {
        h = 60 * (g - b) / (max - min);
    } else if (max == r && g < b) {
        h = 60 * (g - b) / (max - min) + 360;
    } else if (max == g) {
        h = 60 * (b - r) / (max - min) + 120;
    } else if (max == b) {
        h = 60 * (r - g) / (max - min) + 240;
    }

    if (max == 0)
        s = 0;
    else
        s = 1 - min / max;

    v = max;

    return new color(h, s, v);
}


function hsv2rgb(c) {
    let h = c.a,
        s = c.b,
        v = c.c;
    let i = Math.floor(h / 60) % 6;
    let f = h / 60 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i) {
        case 0:
            return new color(v, t, p);
        case 1:
            return new color(q, v, p);
        case 2:
            return new color(p, v, t);
        case 3:
            return new color(p, q, v);
        case 4:
            return new color(t, p, v);
        case 5:
            return new color(v, p, q);
    }

    return null;
}

function lerp(stt, end, percent) {
    let x = stt.x + (end.x - stt.x) * percent;
    let y = stt.y + (end.y - stt.y) * percent;
    return new point(x, y);
}

function point_minus(a, b) {
    return new point(a.x - b.x, a.y - b.y);
}

function angle2deg(angle) {
    return (angle * Math.PI) / 180;
}

function SetPos(obj, x, y) {
    obj.style.left = x + "px";
    obj.style.top = y + "px";
}

function SetupCanvas(canvas) {
    window.devicePixelRatio = 1.25;
    let dpr = window.devicePixelRatio;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    return ctx;
}