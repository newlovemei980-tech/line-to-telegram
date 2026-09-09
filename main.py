import os
import requests
from fastapi import FastAPI, Request, Header, HTTPException
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage

app = FastAPI()

# ระบบจะดึงค่า Token จากหน้าต่างตั้งค่าความปลอดภัยของ Render (ไม่ต้องพิมพ์รหัสลงในโค้ด)
LINE_CHANNEL_ACCESS_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")
LINE_CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

line_bot_api = LineBotApi(LINE_CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(LINE_CHANNEL_SECRET)

def send_to_telegram(text_message):
    telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": text_message, "parse_mode": "Markdown"}
    try:
        response = requests.post(telegram_url, json=payload)
        return response.json()
    except Exception as e:
        print(f"Error to Telegram: {e}")
        return None

@app.get("/")
def read_root():
    return {"status": "Online"}

@app.post("/webhook")
async def webhook(request: Request, x_line_signature: str = Header(None)):
    body = await request.body()
    body_str = body.decode("utf-8")
    try:
        handler.handle(body_str, x_line_signature)
    except InvalidSignatureError:
        raise HTTPException(status_code=400, detail="Invalid Signature")
    return "OK"

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    user_message = event.message.text
    try:
        profile = line_bot_api.get_profile(event.source.user_id)
        display_name = profile.display_name
    except Exception:
        display_name = "ผู้ใช้ LINE"

    formatted_message = f"💬 *มีข้อความจาก LINE*\n👤 {display_name}: {user_message}"
    send_to_telegram(formatted_message)
