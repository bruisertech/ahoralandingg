from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        viewport={'width': 800, 'height': 600}, # Smaller viewport to test text wrapping
        record_video_dir="/home/jules/verification/videos_v5/",
        record_video_size={"width": 800, "height": 600}
    )
    page = context.new_page()

    html_path = "file:///app/index.html"
    page.goto(html_path)

    os.makedirs("/home/jules/verification/screenshots_v5", exist_ok=True)

    time.sleep(2)
    page.screenshot(path="/home/jules/verification/screenshots_v5/initial.png")

    context.close()
    browser.close()
