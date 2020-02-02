my_leaf.draw();
moon.draw();
UpdateSun();
UpdateMoon();

ChangeDay(GetDayPercent());
let day_interval = setInterval(function() {
    ChangeDay(GetDayPercent());
}, 60000);

let speedup = false;
let speedup_time = 0,
    speedup_interval = 0.002;

function restart() {
    dark = false,
        bright = false;
    speedup = false;
    ChangeDay(GetDayPercent());
    day_interval = setInterval(function() {
        ChangeDay(GetDayPercent());
    }, 60000);
}

document.addEventListener('keydown', event => {
    if (event.code == "KeyS") {
        // console.log(speedup_time);
        if (!speedup) {
            clearInterval(day_interval);
            speedup = true;
            speedup_time = GetDayPercent();
        }
        speedup_time += speedup_interval;
        speedup_time %= 1;
        ChangeDay(speedup_time);
    }
})

document.addEventListener('keyup', event => {
    if (event.code == "KeyS") {
        restart();
    }
})


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
        count++;
    }
})