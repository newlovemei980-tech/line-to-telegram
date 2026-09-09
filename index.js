const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();

// ==============================
// ตั้งค่าตรงนี้
// ==============================

// LINE Developers
const LINE_CHANNEL_SECRET = 'a37c499c89190586c1fc579a5909bce6';

// Telegram Bot
const TELEGRAM_TOKEN = '8945676695:AAHsxv4-ZwCYpJGgmwKMeMDKV0PD4SNpsi0';

// Chat ID ของกลุ่ม Telegram
const TELEGRAM_CHAT_ID = '-5429976426';


// ==============================
// รับ Raw Body จาก LINE
// ห้ามใช้ express.json() ก่อนตรวจ Signature
// ==============================

app.use('/webhook', express.raw({ type: 'application/json' }));


// ==============================
// ตรวจสอบว่า Webhook มาจาก LINE จริง
// ==============================

function verifyLineSignature(body, signature) {

    const hash = crypto
        .createHmac('sha256', LINE_CHANNEL_SECRET)
        .update(body)
        .digest('base64');

    return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
    );
}


// ==============================
// ส่งข้อความไป Telegram
// ==============================

async function sendToTelegram(message) {

    const telegramUrl =
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    await axios.post(telegramUrl, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message
    });
}


// ==============================
// LINE Webhook
// ==============================

app.post('/webhook', async (req, res) => {

    try {

        const signature = req.headers['x-line-signature'];

        if (!signature) {
            return res.sendStatus(401);
        }

        // ตรวจสอบ Signature
        const valid = verifyLineSignature(
            req.body,
            signature
        );

        if (!valid) {
            console.log('❌ LINE Signature ไม่ถูกต้อง');
            return res.sendStatus(401);
        }

        // แปลง Raw Body เป็น JSON
        const data = JSON.parse(req.body.toString('utf8'));

        console.log('LINE Webhook:', JSON.stringify(data));

        // ถ้า LINE ส่ง Webhook ทดสอบมา
        if (!data.events || data.events.length === 0) {
            return res.sendStatus(200);
        }

        // วนอ่านข้อความ
        for (const event of data.events) {

            // รับเฉพาะข้อความตัวหนังสือ
            if (
                event.type === 'message' &&
                event.message &&
                event.message.type === 'text'
            ) {

                const userMessage = event.message.text;

                console.log('ข้อความจาก LINE:', userMessage);

                // ส่งเข้า Telegram
                await sendToTelegram(
                    📢 ข้อความจาก LINE\n\n${userMessage}
                );
            }
        }

        res.sendStatus(200);

    } catch (error) {

        console.error('❌ ERROR:', error.message);

        res.sendStatus(500);
    }
});


// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
