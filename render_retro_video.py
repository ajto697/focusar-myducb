import os
import math
import struct
import wave
import subprocess
from PIL import Image, ImageDraw

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output_videos")
os.makedirs(OUTPUT_DIR, exist_ok=True)
FRAMES_DIR = os.path.join(OUTPUT_DIR, "temp_frames")
os.makedirs(FRAMES_DIR, exist_ok=True)

# 1. Authentic NES Color Palette (RGB)
NES = {
    "BLACK":       (0, 0, 0),
    "DARK_GRAY":   (68, 68, 68),
    "MED_GRAY":    (136, 136, 136),
    "WHITE":       (255, 255, 255),
    "SKY_DARK":    (0, 56, 136),
    "SKY_MED":     (0, 88, 248),
    "SKY_LIGHT":   (60, 188, 252),
    "SKY_PALE":    (164, 228, 252),
    "MOUNTAIN_HI": (168, 112, 72),
    "MOUNTAIN_LO": (80, 48, 0),
    "MOUNTAIN_DK": (48, 16, 0),
    "CASTLE_WALL": (116, 116, 116),
    "CASTLE_DARK": (64, 64, 64),
    "CASTLE_ROOF": (107, 32, 122),
    "GRASS_DARK":  (0, 80, 0),
    "GRASS_LIGHT": (0, 168, 0),
    "BRICK_BASE":  (184, 96, 0),
    "BRICK_SHADOW":(80, 40, 0),
    "BRICK_MORTAR":(40, 20, 0),
    "GOLD_LIGHT":  (252, 184, 0),
    "GOLD_DARK":   (168, 112, 0),
    "KNIGHT_BLUE": (0, 120, 248),
    "KNIGHT_DARK": (0, 32, 136),
    "KNIGHT_HORN": (248, 184, 0),
    "KNIGHT_SKIN": (252, 116, 96),
    "BLADE_STEEL": (164, 228, 252),
    "SLIME_GREEN": (88, 216, 84),
    "SLIME_EYE":   (0, 32, 0),
    "BAT_BODY":    (168, 68, 32),
    "BAT_WING":    (68, 24, 16),
    "RED_HEART":   (228, 0, 88),
    "EMPTY_HEART": (56, 16, 24)
}

# 4x4 Bayer Dither Matrix
BAYER_4X4 = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5]
]

FONT_MAP = {
    '0': [0x7,0x5,0x5,0x5,0x7],
    '1': [0x2,0x6,0x2,0x2,0x7],
    '2': [0x7,0x1,0x7,0x4,0x7],
    '3': [0x7,0x1,0x3,0x1,0x7],
    '4': [0x5,0x5,0x7,0x1,0x1],
    '5': [0x7,0x4,0x7,0x1,0x7],
    '6': [0x7,0x4,0x7,0x5,0x7],
    '7': [0x7,0x1,0x2,0x2,0x2],
    '8': [0x7,0x5,0x7,0x5,0x7],
    '9': [0x7,0x5,0x7,0x1,0x7],
    'S': [0x7,0x4,0x7,0x1,0x7],
    'T': [0x7,0x2,0x2,0x2,0x2],
    'A': [0x7,0x5,0x7,0x5,0x5],
    'G': [0x7,0x4,0x5,0x5,0x7],
    'E': [0x7,0x4,0x6,0x4,0x7],
    '-': [0x0,0x0,0x7,0x0,0x0],
    'x': [0x0,0x5,0x2,0x5,0x0],
    ' ': [0x0,0x0,0x0,0x0,0x0]
}

def draw_dither_rect(pixels, x, y, w, h, col1, col2, threshold, img_w=256, img_h=240):
    for py in range(h):
        sy = y + py
        if sy < 0 or sy >= img_h: continue
        for px in range(w):
            sx = x + px
            if sx < 0 or sx >= img_w: continue
            val = BAYER_4X4[sy % 4][sx % 4]
            pixels[sx, sy] = col2 if val < threshold else col1

def draw_pixel_text(draw, text, start_x, start_y, color):
    cur_x = start_x
    for ch in text:
        glyph = FONT_MAP.get(ch, FONT_MAP[' '])
        for row in range(5):
            bits = glyph[row]
            for bit in range(3):
                if (bits >> (2 - bit)) & 1:
                    draw.point((cur_x + bit, start_y + row), fill=color)
        cur_x += 5

def draw_heart(draw, x, y, is_full):
    c = NES["RED_HEART"] if is_full else NES["EMPTY_HEART"]
    draw.rectangle([x+1, y, x+3, y+1], fill=c)
    draw.rectangle([x+5, y, x+7, y+1], fill=c)
    draw.rectangle([x, y+2, x+8, y+4], fill=c)
    draw.rectangle([x+1, y+5, x+7, y+6], fill=c)
    draw.rectangle([x+3, y+7, x+5, y+7], fill=c)

def draw_coin_icon(draw, x, y):
    draw.rectangle([x+1, y, x+4, y+5], fill=NES["GOLD_LIGHT"])
    draw.rectangle([x, y+1, x+5, y+4], fill=NES["GOLD_LIGHT"])
    draw.rectangle([x+2, y+2, x+3, y+3], fill=NES["GOLD_DARK"])

def draw_spinning_coin(draw, cx, cy, f):
    frame = f % 4
    if frame == 0:
        draw.rectangle([cx+2, cy, cx+5, cy+7], fill=NES["GOLD_LIGHT"])
        draw.rectangle([cx+1, cy+1, cx+6, cy+6], fill=NES["GOLD_LIGHT"])
        draw.rectangle([cx+3, cy+2, cx+4, cy+5], fill=NES["GOLD_DARK"])
    elif frame in (1, 3):
        draw.rectangle([cx+2, cy, cx+4, cy+7], fill=NES["GOLD_LIGHT"])
        draw.rectangle([cx+3, cy+1, cx+3, cy+6], fill=NES["WHITE"])
    else:
        draw.rectangle([cx+3, cy, cx+4, cy+7], fill=NES["GOLD_LIGHT"])
        draw.rectangle([cx+3, cy+2, cx+3, cy+4], fill=NES["WHITE"])

def draw_slime(draw, sx, sy, squish):
    w = 16 if squish else 14
    h = 8 if squish else 10
    yo = 2 if squish else 0
    draw.rectangle([sx+2, sy+yo, sx+w-3, sy+yo+h-1], fill=NES["SLIME_GREEN"])
    draw.rectangle([sx, sy+yo+3, sx+w-1, sy+yo+h-1], fill=NES["SLIME_GREEN"])
    draw.rectangle([sx+3, sy+yo+2, sx+5, sy+yo+3], fill=NES["WHITE"])
    draw.rectangle([sx+4, sy+yo+4, sx+5, sy+yo+6], fill=NES["SLIME_EYE"])
    draw.rectangle([sx+9, sy+yo+4, sx+10, sy+yo+6], fill=NES["SLIME_EYE"])

def draw_bat(draw, bx, by, wing_up):
    draw.rectangle([bx+5, by+3, bx+8, by+8], fill=NES["BAT_BODY"])
    draw.point((bx+6, by+4), fill=NES["GOLD_LIGHT"])
    draw.point((bx+8, by+4), fill=NES["GOLD_LIGHT"])
    if wing_up:
        draw.rectangle([bx, by, bx+4, by+3], fill=NES["BAT_WING"])
        draw.rectangle([bx+9, by, bx+13, by+3], fill=NES["BAT_WING"])
        draw.rectangle([bx+1, by+4, bx+3, by+5], fill=NES["BAT_WING"])
        draw.rectangle([bx+10, by+4, bx+12, by+5], fill=NES["BAT_WING"])
    else:
        draw.rectangle([bx, by+4, bx+4, by+7], fill=NES["BAT_WING"])
        draw.rectangle([bx+9, by+4, bx+13, by+7], fill=NES["BAT_WING"])
        draw.rectangle([bx+2, by+2, bx+4, by+3], fill=NES["BAT_WING"])
        draw.rectangle([bx+9, by+2, bx+11, by+3], fill=NES["BAT_WING"])

def draw_knight(draw, kx, ky, frame, jump, attacking):
    # Helmet & horns
    draw.rectangle([kx+1, ky, kx+3, ky+4], fill=NES["KNIGHT_HORN"])
    draw.rectangle([kx+12, ky, kx+14, ky+4], fill=NES["KNIGHT_HORN"])
    draw.rectangle([kx+3, ky+3, kx+12, ky+10], fill=NES["KNIGHT_BLUE"])
    draw.rectangle([kx+5, ky+7, kx+11, ky+8], fill=NES["BLACK"])
    draw.rectangle([kx+8, ky+9, kx+9, ky+10], fill=NES["BLACK"])
    # Body
    draw.rectangle([kx+4, ky+11, kx+11, ky+16], fill=NES["KNIGHT_BLUE"])
    draw.rectangle([kx+4, ky+15, kx+11, ky+16], fill=NES["KNIGHT_DARK"])
    # Legs (8fps run cycle)
    if jump:
        draw.rectangle([kx+3, ky+17, kx+6, ky+19], fill=NES["KNIGHT_BLUE"])
        draw.rectangle([kx+9, ky+16, kx+12, ky+19], fill=NES["KNIGHT_BLUE"])
    elif frame == 0:
        draw.rectangle([kx+3, ky+17, kx+5, ky+20], fill=NES["KNIGHT_BLUE"])
        draw.rectangle([kx+10, ky+17, kx+12, ky+20], fill=NES["KNIGHT_BLUE"])
    elif frame == 1:
        draw.rectangle([kx+1, ky+17, kx+4, ky+20], fill=NES["KNIGHT_BLUE"])
        draw.rectangle([kx+9, ky+17, kx+12, ky+19], fill=NES["KNIGHT_BLUE"])
    elif frame == 2:
        draw.rectangle([kx+4, ky+17, kx+6, ky+20], fill=NES["KNIGHT_BLUE"])
        draw.rectangle([kx+9, ky+17, kx+11, ky+20], fill=NES["KNIGHT_BLUE"])
    else:
        draw.rectangle([kx+4, ky+17, kx+7, ky+19], fill=NES["KNIGHT_BLUE"])
        draw.rectangle([kx+11, ky+17, kx+14, ky+20], fill=NES["KNIGHT_BLUE"])

    # Sword
    if attacking:
        draw.rectangle([kx+11, ky+9, kx+14, ky+11], fill=NES["KNIGHT_SKIN"])
        draw.rectangle([kx+14, ky+7, kx+15, ky+13], fill=NES["GOLD_LIGHT"])
        draw.rectangle([kx+16, ky+9, kx+27, ky+11], fill=NES["BLADE_STEEL"])
        draw.rectangle([kx+28, ky+10, kx+29, ky+10], fill=NES["BLADE_STEEL"])
    else:
        draw.rectangle([kx+11, ky+10, kx+13, ky+12], fill=NES["KNIGHT_SKIN"])
        draw.rectangle([kx+12, ky+9, kx+16, ky+10], fill=NES["GOLD_LIGHT"])
        draw.rectangle([kx+15, ky+3, kx+16, ky+9], fill=NES["BLADE_STEEL"])
        draw.rectangle([kx+16, ky+2, kx+17, ky+3], fill=NES["BLADE_STEEL"])

def draw_platform(draw, x, y, w, h):
    draw.rectangle([x, y, x+w-1, y+1], fill=NES["GRASS_LIGHT"])
    draw.rectangle([x, y+2, x+w-1, y+3], fill=NES["GRASS_DARK"])
    brick_h, brick_w = 8, 16
    for by in range(y+4, y+h, brick_h):
        row_idx = (by - y) // brick_h
        shift = 0 if row_idx % 2 == 0 else 8
        for bx in range(x, x+w, brick_w):
            ax = bx + shift
            dw = min(brick_w - 2, x + w - ax)
            if dw <= 0: continue
            draw.rectangle([ax, by, ax+dw-1, by+brick_h-3], fill=NES["BRICK_BASE"])
            draw.line([(ax, by+brick_h-3), (ax+dw-1, by+brick_h-3)], fill=NES["BRICK_SHADOW"])
            draw.line([(ax+dw-1, by), (ax+dw-1, by+brick_h-3)], fill=NES["BRICK_SHADOW"])
        draw.rectangle([x, by+brick_h-2, x+w-1, by+brick_h-1], fill=NES["BRICK_MORTAR"])

print("Generating 80 frames at 8 FPS (10.0 seconds of authentic retro animation)...")

TOTAL_FRAMES = 80  # 10 seconds at 8fps
# Timeline scripted actions:
# Frame 0-20: Running right
# Frame 21-38: Jumping over chasm and attacking bat/slime in air!
# Frame 39-55: Land on upper ledge, collect coins
# Frame 56-79: Victory run and stand

for i in range(TOTAL_FRAMES):
    img = Image.new("RGB", (256, 240), NES["BLACK"])
    draw = ImageDraw.Draw(img)
    pixels = img.load()

    scroll_x = int(i * 1.5)

    # 1. Sky Gradient with Bayer Matrix Dithering
    draw.rectangle([0, 0, 255, 29], fill=NES["SKY_DARK"])
    draw_dither_rect(pixels, 0, 30, 256, 16, NES["SKY_DARK"], NES["SKY_MED"], 8)
    draw.rectangle([0, 46, 255, 77], fill=NES["SKY_MED"])
    draw_dither_rect(pixels, 0, 78, 256, 16, NES["SKY_MED"], NES["SKY_LIGHT"], 8)
    draw.rectangle([0, 94, 255, 134], fill=NES["SKY_LIGHT"])

    # 2. Clouds
    for cbase_x, cbase_y in [(30, 22), (140, 36), (220, 26)]:
        cx = int((cbase_x - scroll_x * 0.2) % 280) - 20
        draw.rectangle([cx+4, cbase_y, cx+23, cbase_y+5], fill=NES["SKY_PALE"])
        draw.rectangle([cx, cbase_y+4, cx+29, cbase_y+11], fill=NES["SKY_PALE"])
        draw.rectangle([cx+8, cbase_y-4, cx+19, cbase_y+1], fill=NES["SKY_PALE"])
        draw_dither_rect(pixels, cx+2, cbase_y+10, 26, 3, NES["SKY_PALE"], NES["SKY_LIGHT"], 9)

    # 3. Mountains with Dithered Shadows
    for mx, my, mw, mh in [(10 - int(scroll_x * 0.3) % 180, 40, 70, 95), (70 - int(scroll_x * 0.3) % 180, 60, 50, 75)]:
        mid = mx + mw // 2
        for r in range(mh):
            cur_y = my + r
            if cur_y >= 135: break
            w_half = int((r / mh) * (mw / 2))
            draw.line([(mid - w_half, cur_y), (mid, cur_y)], fill=NES["MOUNTAIN_HI"])
            for dx in range(w_half):
                sx = mid + dx
                if 0 <= sx < 256:
                    val = BAYER_4X4[cur_y % 4][sx % 4]
                    pixels[sx, cur_y] = NES["MOUNTAIN_DK"] if val < 9 else NES["MOUNTAIN_LO"]

    # 4. Castle in Background
    cx = 175 - int(scroll_x * 0.4)
    if -50 <= cx <= 260:
        draw.rectangle([cx+10, 90, cx+57, 134], fill=NES["CASTLE_WALL"])
        draw.rectangle([cx, 80, cx+13, 134], fill=NES["CASTLE_WALL"])
        draw.rectangle([cx+24, 70, cx+43, 134], fill=NES["CASTLE_WALL"])
        draw.rectangle([cx+50, 84, cx+63, 134], fill=NES["CASTLE_WALL"])
        draw.rectangle([cx+28, 114, cx+39, 134], fill=NES["BLACK"])
        draw_dither_rect(pixels, cx+38, 76, 6, 58, NES["CASTLE_WALL"], NES["CASTLE_DARK"], 8)

    # 5. Distant Pine Trees
    for px in range(- (int(scroll_x * 0.6) % 12), 270, 12):
        for t in range(3):
            ty = 135 - 22 + t * 8
            tw = 6 + t * 4
            for r in range(9):
                rw = int((r / 9) * tw)
                draw.line([(px - rw, ty + r), (px + rw, ty + r)], fill=NES["GRASS_DARK"])

    # 6. Platforms
    draw_platform(draw, 0, 172, 86, 40)
    draw.rectangle([86, 176, 149, 212], fill=NES["BLACK"]) # gap
    draw_platform(draw, 150, 172, 106, 40)
    draw_platform(draw, 190, 136, 66, 36)

    # 7. Collectibles (Coins)
    coin_f = (i // 2) % 4
    if i < 48:
        draw_spinning_coin(draw, 148, 156, coin_f)
        draw_spinning_coin(draw, 164, 156, coin_f + 1)
    if i < 60:
        draw_spinning_coin(draw, 232, 122, coin_f + 2)

    # 8. Enemies
    # Slime squishing on lower platform
    slime_x = int(190 + math.sin(i * 0.4) * 25)
    draw_slime(draw, slime_x, 164, (i % 2 == 0))

    # Bats flying in sky
    bat1_x = int(70 + math.sin(i * 0.3) * 20)
    bat1_y = int(55 + math.cos(i * 0.5) * 8)
    draw_bat(draw, bat1_x, bat1_y, (i % 4 < 2))

    bat2_x = int(160 + math.sin(i * 0.3 + 2.0) * 15)
    bat2_y = int(45 + math.cos(i * 0.4) * 6)
    draw_bat(draw, bat2_x, bat2_y, (i % 4 >= 2))

    # 9. Knight Movement & Jump Simulation at 8 FPS
    kx, ky = 40, 152
    jump = False
    attacking = False
    run_frame = (i % 4)

    if i < 20: # Running
        kx = 40 + i * 2
        ky = 152
    elif i < 38: # Jumping over gap
        jump = True
        prog = (i - 20) / 18.0
        kx = int(80 + prog * 95)
        ky = int(152 - math.sin(prog * math.pi) * 45)
        if 26 <= i <= 32:
            attacking = True
    elif i < 55: # Landing on upper ledge
        kx = int(175 + (i - 38) * 1.5)
        ky = 116
    else: # Reached castle goal
        kx = 205
        ky = 116
        run_frame = 0

    draw_knight(draw, kx, ky, run_frame, jump, attacking)

    # 10. NES HUD
    draw_pixel_text(draw, "STAGE 1-2", 168, 14, NES["WHITE"])
    for h in range(6):
        draw_heart(draw, 16 + h * 11, 220, h < 5)
    score_val = 1500 + (300 if i >= 48 else 0) + (500 if i >= 60 else 0)
    draw_pixel_text(draw, f"{score_val:06d}", 96, 222, NES["WHITE"])
    draw.rectangle([174, 214, 189, 229], fill=NES["DARK_GRAY"])
    draw.rectangle([176, 216, 187, 227], fill=NES["BLACK"])
    draw.rectangle([182, 217, 183, 222], fill=NES["BLADE_STEEL"])
    draw.rectangle([180, 223, 185, 224], fill=NES["GOLD_LIGHT"])
    draw.rectangle([182, 225, 183, 226], fill=NES["GOLD_LIGHT"])
    draw_coin_icon(draw, 204, 219)
    coins_val = 14 + (2 if i >= 48 else 0) + (1 if i >= 60 else 0)
    draw_pixel_text(draw, f"x{coins_val:02d}", 216, 222, NES["GOLD_LIGHT"])

    # Scale 4x to 1024x960 using NEAREST filter (Zero anti-aliasing, pure sharp pixels)
    upscaled = img.resize((1024, 960), resample=Image.Resampling.NEAREST)

    frame_path = os.path.join(FRAMES_DIR, f"frame_{i:04d}.png")
    upscaled.save(frame_path)

print("Frames generated successfully!")

# 11. Synthesize 10-second 8-Bit NES Chiptune Audio
print("Synthesizing 8-bit NES chiptune soundtrack (square & triangle channels)...")
sample_rate = 44100
duration = TOTAL_FRAMES / 8.0 # 10.0 seconds
total_samples = int(sample_rate * duration)

audio_path = os.path.join(OUTPUT_DIR, "nes_chiptune.wav")
wav_file = wave.open(audio_path, 'w')
wav_file.setnchannels(1)
wav_file.setsampwidth(2)
wav_file.setframerate(sample_rate)

melody_notes = [
    261.63, 329.63, 392.00, 523.25, # C4, E4, G4, C5
    220.00, 261.63, 329.63, 440.00, # A3, C4, E4, A4
    174.61, 220.00, 261.63, 349.23, # F3, A3, C4, F4
    196.00, 246.94, 293.66, 392.00  # G3, B3, D4, G4
]

note_duration = 1.0 / 8.0 # 1 note per frame (8 notes/sec)
samples_per_note = int(sample_rate * note_duration)

audio_data = bytearray()
for s in range(total_samples):
    t = s / sample_rate
    note_idx = int(s / samples_per_note)
    freq = melody_notes[note_idx % len(melody_notes)]
    
    # 50% square wave (Pulse 1)
    phase = (t * freq) % 1.0
    pulse = 1.0 if phase < 0.5 else -1.0
    
    # Note envelope decay
    t_in_note = (s % samples_per_note) / samples_per_note
    env = max(0.0, 1.0 - t_in_note * 0.8)
    sample_val = pulse * 0.18 * env

    # Triangle wave bass channel (sub-octave)
    bass_freq = freq / 2.0
    bass_phase = (t * bass_freq) % 1.0
    triangle = 2.0 * abs(2.0 * (bass_phase - math.floor(bass_phase + 0.5))) - 1.0
    sample_val += triangle * 0.22

    # Add SFX at jump (frame 20 to 22 = t ~ 2.5s)
    if 2.5 <= t <= 2.65:
        j_t = t - 2.5
        j_freq = 150 + j_t * 1200
        j_phase = (t * j_freq) % 1.0
        sample_val += (1.0 if j_phase < 0.5 else -1.0) * 0.25

    # Add SFX at sword slash (frame 26 to 28 = t ~ 3.25s)
    if 3.25 <= t <= 3.38:
        sl_t = t - 3.25
        sl_freq = max(80, 500 - sl_t * 3000)
        sl_phase = (t * sl_freq) % 1.0
        sample_val += (2.0 * sl_phase - 1.0) * 0.3

    # Clamping & conversion to 16-bit PCM
    sample_val = max(-1.0, min(1.0, sample_val))
    pcm_int = int(sample_val * 32767)
    audio_data.extend(struct.pack('<h', pcm_int))

wav_file.writeframes(audio_data)
wav_file.close()
print("Audio synthesized successfully:", audio_path)

# 12. Run ffmpeg to compile MP4 and WebM
mp4_output = os.path.join(OUTPUT_DIR, "nes_retro_8bit_animation.mp4")
webm_output = os.path.join(OUTPUT_DIR, "nes_retro_8bit_animation.webm")

ffmpeg_cmd_mp4 = [
    "ffmpeg", "-y",
    "-r", "8",
    "-i", os.path.join(FRAMES_DIR, "frame_%04d.png"),
    "-i", audio_path,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    "-preset", "veryfast",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    mp4_output
]

print("Compiling MP4 video with ffmpeg...")
res = subprocess.run(ffmpeg_cmd_mp4, capture_output=True, text=True)
if res.returncode == 0:
    print("[SUCCESS] MP4 created successfully:", mp4_output)
else:
    print("[ERROR] FFmpeg MP4 error:", res.stderr)

ffmpeg_cmd_webm = [
    "ffmpeg", "-y",
    "-r", "8",
    "-i", os.path.join(FRAMES_DIR, "frame_%04d.png"),
    "-i", audio_path,
    "-c:v", "libvpx-vp9",
    "-crf", "24",
    "-b:v", "0",
    "-c:a", "libopus",
    "-shortest",
    webm_output
]
print("Compiling WebM video with ffmpeg...")
res_webm = subprocess.run(ffmpeg_cmd_webm, capture_output=True, text=True)
if res_webm.returncode == 0:
    print("[SUCCESS] WebM created successfully:", webm_output)
else:
    print("[ERROR] FFmpeg WebM error:", res_webm.stderr)

print("Video generation finished!")
