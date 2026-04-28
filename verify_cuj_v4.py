from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        record_video_dir="/home/jules/verification/videos_v4/",
        record_video_size={"width": 1280, "height": 720}
    )
    page = context.new_page()

    html_path = "file:///app/index.html"
    page.goto(html_path)

    os.makedirs("/home/jules/verification/screenshots_v4", exist_ok=True)

    # Wait for the initial load and animations to settle
    time.sleep(2)
    page.screenshot(path="/home/jules/verification/screenshots_v4/initial.png")

    context.close()
    browser.close()
