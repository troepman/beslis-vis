import sys;
import numpy as np;
from moviepy.editor import VideoFileClip

def detect_box_in_array(arr):
    x_min = np.argmax(arr, axis=0).min()
    x_max = np.argmax(arr[::-1, :], axis=0).max()

    y_min = np.argmax(arr, axis=1).min()
    y_max = np.argmax(arr[:, ::-1], axis=1).max()

    return (x_min, y_min), (x_max, y_max)

def detect_fish_center(frame, threshold = 0.1):
    fish_present = np.any(frame > threshold, axis=2)

    box_p1, box_p2 = detect_box_in_array(fish_present)

    return (box_p1[0] + box_p2[0]) / 2, (box_p1[1] + box_p2[1]) / 2

def fish_in_good_end_position(fish_center, frame_size, margins=100):
    # too high or too low
    if fish_center[1] < margins or fish_center[1] > (frame_size[1] - margins):
        return False

    # to close to the sides
    if fish_center[0] < margins or fish_center[0] > (frame_size[0] - margins):
        return False

    # straight in the middle
    if abs(fish_center[0] - frame_size[0] / 2) < margins:
        return False

    return True

def main(video_file):
    print("Loading", video_file)
    raw = VideoFileClip(video_file)
    print(f"Video duration {raw.duration}s, size {raw.size}")
    fragment_counter = 0

    for time in range(15, int(raw.duration), 15):
        print(f"Processing {time}s")
        frame = raw.get_frame(time)

        fish_position = detect_fish_center(frame)
        print(f"Fish position {fish_position}")

        if not fish_in_good_end_position(fish_position, raw.size):
            continue
        print("Creating fragment")
        fragment = raw.subclip(time - 15, time)

        fragment.write_videofile(f"fragment{fragment_counter}.mp4", codec="libx264")
        fragment_counter += 1

if __name__ == "__main__":
    main(sys.argv[-1])