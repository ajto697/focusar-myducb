import os
import sys
import math
import time
import struct
import wave
import subprocess
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "output_videos")
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH = 1280
HEIGHT = 720
FPS = 20
TOTAL_DURATION = 180 # 3 minutes = 180s
TOTAL_FRAMES = TOTAL_DURATION * FPS # 3600 frames
SCENE_DURATION = 30 # each scene is 30 seconds
FRAMES_PER_SCENE = SCENE_DURATION * FPS # 600 frames per scene

# Colors
C_GOLD = (245, 180, 40)
C_DARK_BLUE = (15, 23, 42)
C_CARD_BG = (12, 18, 30, 220)
C_WHITE = (255, 255, 255)
C_YELLOW = (255, 225, 80)
C_CYAN = (56, 189, 248)

# Load fonts
try:
    font_title = ImageFont.truetype("arialbd.ttf", 22)
    font_speaker = ImageFont.truetype("arialbd.ttf", 20)
    font_sub = ImageFont.truetype("arial.ttf", 22)
    font_badge = ImageFont.truetype("arialbd.ttf", 15)
except Exception:
    font_title = ImageFont.load_default()
    font_speaker = font_title
    font_sub = font_title
    font_badge = font_title

# Scene Definitions
SCENES = [
    {
        "id": 1,
        "bg_file": "egypt_scene_1_map.jpg",
        "title": "CẢNH 1: VỊ TRÍ CHIẾN LƯỢC & NGÃ TƯ Á - PHI",
        "badge": "DIỆN TÍCH: 1.002.450 km² | VỊ TRÍ: ĐÔNG BẮC PHI & TÂY Á",
        "subs": [
            (0, 7.5, "Xin chào các bạn! Mình là Cú Thông Thái. Hôm nay chúng ta cùng khám phá toàn cảnh địa lí đất nước Ai Cập kỳ thú!"),
            (7.5, 15, "Ai Cập có diện tích hơn 1.000.000 km², phía Bắc giáp Địa Trung Hải, phía Đông giáp Biển Đỏ, Tây giáp Libya, Nam giáp Sudan."),
            (15, 22.5, "Đặc biệt, bán đảo Sinai hình tam giác nằm trọn ở Tây Á, biến Ai Cập thành quốc gia liên lục địa độc nhất vô nhị!"),
            (22.5, 30, "Án ngữ ngã tư hàng hải Á - Phi, từ ngàn năm Ai Cập đã là trung tâm giao thương chiến lược hàng đầu hành tinh.")
        ]
    },
    {
        "id": 2,
        "bg_file": "egypt_scene_2_regions.jpg",
        "title": "CẢNH 2: 4 MIỀN ĐỊA HÌNH TỰ NHIÊN CỐT LÕI",
        "badge": "4 MIỀN: CHÂU THỔ NILE | SA MẠC TÂY | SA MẠC ĐÔNG | SINAI (2.629m)",
        "subs": [
            (0, 7.5, "Địa hình Ai Cập được phân định thành 4 miền tự nhiên rõ rệt với sự tương phản vô cùng kỳ vĩ!"),
            (7.5, 15, "Thứ nhất là Thung lũng & Châu thổ Sông Nile: chỉ chiếm 4% diện tích đất nhưng là nơi tập trung hơn 95% cư dân."),
            (15, 22.5, "Thứ hai là Sa mạc Tây chiếm 68% diện tích, có Vùng trũng Qattara sâu -133m dưới mực nước biển và các ốc đảo xanh tươi."),
            (22.5, 30, "Thứ ba là Sa mạc Đông nhiều núi đá khoáng sản, và thứ tư là Sinai với đỉnh Saint Catherine cao nhất nước: 2.629 mét!")
        ]
    },
    {
        "id": 3,
        "bg_file": "egypt_scene_3_dam.jpg",
        "title": "CẢNH 3: THỦY VĂN SÔNG NILE & ĐẬP CAO ASWAN",
        "badge": "SÔNG NILE: 6.650 km (DÀI NHẤT THẾ GIỚI) | HỒ NASSER: DÀI 500 km",
        "subs": [
            (0, 7.5, "Sử gia Hy Lạp cổ Herodotus từng viết: 'Ai Cập là món quà của sông Nile' - dòng sông dài 6.650 km chảy ngược về phía Bắc."),
            (7.5, 15, "Mỗi mùa lũ, phù sa đen màu mỡ được bồi đắp biến hai bờ sông thành dải lụa xanh trù phú xuyên qua lòng sa mạc khô cằn."),
            (15, 22.5, "Ở phía Nam, người Ai Cập đã xây dựng đại công trình Đập cao Aswan để ngăn dòng lũ dữ và cung cấp nguồn điện khổng lồ."),
            (22.5, 30, "Phía sau đập là Hồ Nasser dài gần 500 km - một trong những hồ chứa nước nhân tạo ngọt ngào lớn nhất thế giới!")
        ]
    },
    {
        "id": 4,
        "bg_file": "egypt_scene_4_suez.jpg",
        "title": "CẢNH 4: KÊNH ĐÀO SUEZ - HUYẾT MẠCH HÀNG HẢI TOÀN CẦU",
        "badge": "KÊNH SUEZ: DÀI 193,3 km | ĐẢM NHẬN ~12% GIAO THƯƠNG HÀNG HẢI THẾ GIỚI",
        "subs": [
            (0, 7.5, "Cắt ngang qua eo đất sa mạc Suez, con người đã tạo nên một kỳ tích giao thông hàng hải làm thay đổi cả thế giới!"),
            (7.5, 15, "Kênh đào Suez dài 193,3 km, chính thức thông thương năm 1869, nối liền trực tiếp Địa Trung Hải với Biển Đỏ."),
            (15, 22.5, "Tuyến đường thủy này giúp các đội tàu rút ngắn hàng ngàn dặm hành trình mà không phải vòng qua Mũi Hảo Vọng châu Phi."),
            (22.5, 30, "Ngày nay, kênh Suez đảm nhận khoảng 12% tổng thương mại hàng hải thế giới, là huyết mạch kinh tế của Ai Cập và toàn cầu.")
        ]
    },
    {
        "id": 5,
        "bg_file": "egypt_scene_5_desert.jpg",
        "title": "CẢNH 5: KHÍ HẬU HOANG MẠC, BÃO CÁT KHAMSIN & SA MẠC TRẮNG",
        "badge": "KHÍ HẬU: HOANG MẠC KHÔ HẠN | HIỆN TƯỢNG: BÃO KHAMSIN | KỲ QUAN SA MẠC TRẮNG",
        "subs": [
            (0, 7.5, "Ai Cập mang khí hậu hoang mạc cực kỳ khô hạn, lượng mưa hàng năm tại nhiều khu vực nội địa chỉ dưới 25 milimet!"),
            (7.5, 15, "Nhiệt độ ban ngày mùa hè có thể chạm 45 độ C, nhưng ban đêm lại hạ rất sâu do mặt cát sa mạc không giữ được nhiệt."),
            (15, 22.5, "Vào mùa xuân, bão cát Khamsin khô nóng cuồn cuộn thổi bụi mù mịt từ sa mạc suốt 50 ngày ròng rã thử thách lòng người."),
            (22.5, 30, "Nhưng sa mạc cũng cất giấu kỳ quan Sa Mạc Trắng với đá phấn hình nấm triệu năm và ốc đảo Siwa mát lành đầy cây chà là.")
        ]
    },
    {
        "id": 6,
        "bg_file": "egypt_scene_6_cairo.jpg",
        "title": "CẢNH 6: DÂN CƯ, SIÊU ĐÔ THỊ CAIRO & DI SẢN KỲ QUAN",
        "badge": "DÂN SỐ: >110 TRIỆU | THỦ ĐÔ: CAIRO (>20 TRIỆU DÂN) | KỲ QUAN GIZA",
        "subs": [
            (0, 7.5, "Dân số Ai Cập đã vượt mốc 110 triệu người, tạo nên một nghịch lí phân bố địa bàn dân cư kì thú bậc nhất hành tinh!"),
            (7.5, 15, "95% dân số sống tập trung dọc 4% diện tích châu thổ sông Nile, biến Cairo thành siêu đô thị đông dân nhất thế giới Ả Rập."),
            (15, 22.5, "Ngay cạnh đại kim tự tháp Giza ngàn năm, Ai Cập đang xây dựng Thủ đô Hành chính Mới hiện đại giữa lòng sa mạc."),
            (22.5, 30, "Ai Cập thực sự là bản hòa ca bất diệt giữa thiên nhiên khắc nghiệt và bàn tay con người! Cú hẹn gặp lại các bạn ở tập sau nhé!")
        ]
    }
]

print("1. Synthesizing 3-Minute Egyptian Geography Soundtrack...")
sample_rate = 44100
audio_duration = TOTAL_DURATION # 180s
total_audio_samples = int(sample_rate * audio_duration)
audio_path = os.path.join(OUTPUT_DIR, "egypt_soundtrack.wav")

wav_file = wave.open(audio_path, 'w')
wav_file.setnchannels(2) # Stereo
wav_file.setsampwidth(2) # 16-bit PCM
wav_file.setframerate(sample_rate)

# Egyptian Hijaz / Phrygian Dominant Scale (D, Eb, F#, G, A, Bb, C)
base_d = 146.83 # D3
hijaz_intervals = [1.0, 16/15, 5/4, 4/3, 3/2, 8/5, 9/5, 2.0]
scale_freqs = [base_d * ratio for ratio in hijaz_intervals]
scale_freqs += [f * 2 for f in scale_freqs] # Octave 4

audio_bytes = bytearray()
beat_duration = 0.5 # 120 BPM
samples_per_beat = int(sample_rate * beat_duration)

for s in range(total_audio_samples):
    t = s / sample_rate
    beat_idx = int(s / samples_per_beat)
    t_in_beat = (s % samples_per_beat) / samples_per_beat

    # Oud / Plucked arpeggio melody
    note_pattern = [0, 2, 4, 3, 2, 1, 2, 0, 4, 5, 7, 5, 4, 2, 1, 0]
    note = scale_freqs[note_pattern[beat_idx % len(note_pattern)]]
    decay = math.exp(-t_in_beat * 5.0)
    oud_val = (math.sin(2 * math.pi * note * t) + 0.5 * math.sin(4 * math.pi * note * t)) * decay * 0.18

    # Desert flute / Ney melody (Legato vibrato)
    flute_pattern = [7, 7, 6, 5, 4, 4, 3, 2, 4, 5, 7, 8, 7, 6, 5, 4]
    flute_note = scale_freqs[flute_pattern[(beat_idx // 2) % len(flute_pattern)]]
    vibrato = 1.0 + 0.015 * math.sin(2 * math.pi * 5.0 * t)
    flute_val = math.sin(2 * math.pi * flute_note * vibrato * t) * 0.12

    # Bass Drone (Deep D)
    bass_val = (math.sin(2 * math.pi * (base_d / 2) * t) + 0.4 * math.sin(2 * math.pi * (base_d * 1.5) * t)) * 0.16

    # Soft Darbuka percussion / rhythm tap
    drum_env = math.exp(-t_in_beat * 14.0) if (beat_idx % 2 == 0) else math.exp(-t_in_beat * 20.0)
    drum_pitch = 75 if (beat_idx % 2 == 0) else 130
    drum_val = math.sin(2 * math.pi * drum_pitch * t) * drum_env * 0.18

    # Special SFX for Scene 4 (Ship Horn at t=95s)
    ship_sfx = 0.0
    if 93.0 <= t <= 96.5:
        st = t - 93.0
        horn_env = min(1.0, st * 2.0) * max(0.0, 1.0 - (st - 2.5) / 1.0 if st > 2.5 else 1.0)
        ship_sfx = (math.sin(2 * math.pi * 92.0 * t) + 0.6 * math.sin(2 * math.pi * 138.0 * t)) * horn_env * 0.22

    # Special Desert Wind SFX in Scene 5 (t=120s to 125s)
    wind_sfx = 0.0
    if 120.0 <= t <= 127.0:
        wt = t - 120.0
        w_env = math.sin((wt / 7.0) * math.pi)
        wind_sfx = (math.sin(2 * math.pi * (180 + 60 * math.sin(t * 1.5)) * t)) * w_env * 0.08

    left = oud_val * 0.8 + flute_val * 0.5 + bass_val * 0.7 + drum_val * 0.6 + ship_sfx + wind_sfx
    right = oud_val * 0.5 + flute_val * 0.8 + bass_val * 0.7 + drum_val * 0.6 + ship_sfx + wind_sfx

    # Master volume clamp
    left = max(-1.0, min(1.0, left * 0.85))
    right = max(-1.0, min(1.0, right * 0.85))

    audio_bytes.extend(struct.pack('<hh', int(left * 32767), int(right * 32767)))

wav_file.writeframes(audio_bytes)
wav_file.close()
print(f"Soundtrack synthesized successfully: {audio_path}")

print("2. Preloading Visual Backgrounds & Transparent Owl Mascot...")
bg_images = {}
for sc in SCENES:
    path = os.path.join(BASE_DIR, sc["bg_file"])
    if os.path.exists(path):
        bg_images[sc["id"]] = Image.open(path).convert("RGB")
    else:
        print(f"Warning: {path} not found! Creating fallback.")
        bg_images[sc["id"]] = Image.new("RGB", (WIDTH, HEIGHT), (200, 160, 100))

# Load transparent owl mascot
owl_path = os.path.join(BASE_DIR, "mascot_owl.png")
if os.path.exists(owl_path):
    owl_raw = Image.open(owl_path).convert("RGBA")
    # Resize to suitable mascot height (approx 340px)
    owl_h = 320
    owl_w = int(owl_raw.width * (owl_h / owl_raw.height))
    owl_sprite = owl_raw.resize((owl_w, owl_h), Image.Resampling.LANCZOS)
else:
    print("Warning: mascot_owl.png not found!")
    owl_sprite = Image.new("RGBA", (200, 260), (255, 200, 50, 255))

print("3. Launching FFmpeg Video Streaming Pipeline...")
mp4_output = os.path.join(OUTPUT_DIR, "dia_li_toan_canh_ai_cap_3phut.mp4")

ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-pix_fmt", "rgb24",
    "-r", str(FPS),
    "-i", "-",
    "-i", audio_path,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-pix_fmt", "yuv420p",
    "-crf", "20",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    mp4_output
]

pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

t_start = time.time()
print(f"Rendering {TOTAL_FRAMES} frames ({TOTAL_DURATION} seconds) directly into FFmpeg...")

for frame_idx in range(TOTAL_FRAMES):
    curr_time = frame_idx / FPS
    scene_idx = min(len(SCENES) - 1, int(curr_time // SCENE_DURATION))
    scene = SCENES[scene_idx]
    scene_local_time = curr_time % SCENE_DURATION

    # 1. Background Camera Motion (Ken Burns Pan & Gentle Zoom)
    raw_bg = bg_images[scene["id"]]
    progress = scene_local_time / SCENE_DURATION
    
    # Zoom from 1.0 to 1.14
    zoom = 1.0 + 0.14 * progress
    crop_w = int(raw_bg.width / zoom)
    crop_h = int(raw_bg.height / zoom)
    
    # Pan direction alternates by scene
    if scene["id"] % 2 == 1:
        crop_x = int((raw_bg.width - crop_w) * progress)
        crop_y = int((raw_bg.height - crop_h) * 0.5)
    else:
        crop_x = int((raw_bg.width - crop_w) * (1.0 - progress))
        crop_y = int((raw_bg.height - crop_h) * progress)

    crop_x = max(0, min(raw_bg.width - crop_w, crop_x))
    crop_y = max(0, min(raw_bg.height - crop_h, crop_y))

    bg_cropped = raw_bg.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h))
    frame_img = bg_cropped.resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)

    # Convert to RGBA for clean alpha blending overlays
    frame_rgba = frame_img.convert("RGBA")
    overlay_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay_layer)

    # 2. Top Header Bar (Educational Theme & Badges)
    # Dark gradient header bar
    overlay_draw.rectangle([0, 0, WIDTH, 54], fill=(10, 16, 28, 210))
    overlay_draw.line([(0, 54), (WIDTH, 54)], fill=C_GOLD, width=2)
    
    # Title & Topic
    overlay_draw.text((24, 15), f"🌍 KHÁM PHÁ ĐỊA LÍ: ĐẤT NƯỚC AI CẬP  |  {scene['title']}", fill=C_WHITE, font=font_title)

    # Top right: Key stat badge
    badge_text = scene["badge"]
    badge_w = len(badge_text) * 8 + 30
    badge_x = WIDTH - badge_w - 20
    overlay_draw.rounded_rectangle([badge_x, 10, WIDTH - 20, 44], radius=6, fill=(30, 41, 59, 230), outline=C_CYAN, width=1)
    overlay_draw.text((badge_x + 15, 18), badge_text, fill=C_CYAN, font=font_badge)

    # 3. Subtitle Card at Bottom (High Readability Floating Glass Card)
    card_x0, card_y0 = 36, HEIGHT - 150
    card_x1, card_y1 = WIDTH - 320, HEIGHT - 24
    overlay_draw.rounded_rectangle([card_x0, card_y0, card_x1, card_y1], radius=14, fill=C_CARD_BG, outline=(245, 180, 40, 200), width=2)

    # Speaker identity inside card
    overlay_draw.text((card_x0 + 20, card_y0 + 12), "🦉 Giáo Sư Cú (Dẫn chuyện):", fill=C_GOLD, font=font_speaker)

    # Determine current subtitle line
    current_sub_text = ""
    for start_t, end_t, text in scene["subs"]:
        if start_t <= scene_local_time < end_t:
            current_sub_text = text
            break
    if not current_sub_text and scene["subs"]:
        current_sub_text = scene["subs"][-1][2]

    # Word wrap subtitles if long
    words = current_sub_text.split()
    line1, line2 = "", ""
    for w in words:
        if len(line1 + " " + w) < 56:
            line1 += (" " if line1 else "") + w
        else:
            line2 += (" " if line2 else "") + w

    overlay_draw.text((card_x0 + 20, card_y0 + 44), line1, fill=C_WHITE, font=font_sub)
    if line2:
        overlay_draw.text((card_x0 + 20, card_y0 + 76), line2, fill=C_YELLOW, font=font_sub)

    # Time counter badge in subtitle card
    time_str = f"{int(curr_time // 60):02d}:{int(curr_time % 60):02d} / 03:00"
    overlay_draw.text((card_x1 - 140, card_y0 + 14), time_str, fill=(148, 163, 184), font=font_badge)

    # Composite overlay layer
    frame_composite = Image.alpha_composite(frame_rgba, overlay_layer)

    # 4. Animated Mascot Cú at Bottom Right
    # Gentle breathing bobbing motion
    mascot_bob = math.sin(curr_time * 3.5) * 6
    mascot_x = WIDTH - owl_sprite.width - 25
    mascot_y = HEIGHT - owl_sprite.height - 10 + int(mascot_bob)
    
    # Subtle talking mouth/glow effect
    glow_pulse = int(25 + 15 * math.sin(curr_time * 8.0))
    glow_img = Image.new("RGBA", (owl_sprite.width + 30, owl_sprite.height + 30), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.ellipse([5, 5, owl_sprite.width + 25, owl_sprite.height + 25], fill=(245, 180, 40, glow_pulse))
    frame_composite.paste(glow_img, (mascot_x - 15, mascot_y - 15), glow_img)

    # Paste Mascot Owl
    frame_composite.paste(owl_sprite, (mascot_x, mascot_y), owl_sprite)

    # Pipe RGB raw bytes directly to FFmpeg
    pipe.stdin.write(frame_composite.convert("RGB").tobytes())

    # Progress feedback every 300 frames (15s)
    if (frame_idx + 1) % 300 == 0:
        elapsed = time.time() - t_start
        percent = ((frame_idx + 1) / TOTAL_FRAMES) * 100
        print(f"[{percent:5.1f}%] Rendered {frame_idx + 1}/{TOTAL_FRAMES} frames ({curr_time:.1f}s) in {elapsed:.1f}s...")

pipe.stdin.close()
pipe.wait()
total_render_time = time.time() - t_start
print(f"Done! Full 3-Minute 1080p/720p Video Created in {total_render_time:.2f}s!")
print(f"Output File: {mp4_output}")
