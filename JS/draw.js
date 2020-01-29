my_leaf.draw();
moon.draw();
UpdateSun();
UpdateMoon();

ChangeDay();
window.setInterval(ChangeDay, 60000);
setInterval(UpdateSun, 60000);
setInterval(UpdateMoon, 60000);

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