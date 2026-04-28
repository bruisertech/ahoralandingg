from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    # Using specific screen size for consistent visual verification
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        record_video_dir="/home/jules/verification/videos_v2/",
        record_video_size={"width": 1280, "height": 720}
    )
    page = context.new_page()

    html_path = "file:///app/index.html"
    page.goto(html_path)

    os.makedirs("/home/jules/verification/screenshots_v2", exist_ok=True)

    # Wait for the initial load and animations to settle
    time.sleep(2)
    page.screenshot(path="/home/jules/verification/screenshots_v2/initial.png")

    # Perform a scroll to trigger the GSAP "abrir" animation
    page.mouse.wheel(0, 300)

    # Wait for the timeline animation (1.2s + buffer)
    time.sleep(2)
    page.screenshot(path="/home/jules/verification/screenshots_v2/scrolled_down.png")

    # Scroll back up to trigger the GSAP "cerrar" reverse animation
    page.mouse.wheel(0, -300)

    # Wait for the reverse animation
    time.sleep(2)
    page.screenshot(path="/home/jules/verification/screenshots_v2/scrolled_up.png")

    context.close()
    browser.close()
