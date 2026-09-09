 const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ฝังรหัสตรงเพื่อความถูกต้อง 100%
const TELEGRAM_TOKEN = '8945676695:AAHsxv4-ZwCYpJGgmwKMeMDKV0PD4SNpsi0';
const TELEGRAM_CHAT_ID = '-5429976426';

app.post('/webhook', async (req, res) => {
    try {
        const events = req.body.events;
        if (events && events.length > 0) {
            for (let event of events) {
                if (event.type === 'message' && event.message.type === 'text') {
                    const userMessage = event.message.text;
                    
                    // แก้ไขลิงก์ส่งข้อความของ Telegram API ให้ถูกต้อง
                    const telegramUrl = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;
                    
                    await axios.post(telegramUrl, {
                        chat_id: TELEGRAM_CHAT_ID,
                        text: `📢 มีข้อความจาก LINE:\n\n${userMessage}`
                    });
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error:', error.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
