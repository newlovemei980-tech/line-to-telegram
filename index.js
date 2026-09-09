YOUR_TELEGRAM_TOKEN ="8945676695:AAHsxv4-ZwCYpJGgmwKMeMDKV0PD4SNpsi0"
YOUR_CHAT_ID ="-5429976426"
const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

// Telegram Bot
const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

app.post('/webhook', async (req, res) => {
    try {
        const events = req.body.events;

        if (events && events.length > 0) {
            for (const event of events) {

                if (
                    event.type === 'message' &&
                    event.message.type === 'text'
                ) {
                    const userMessage = event.message.text;

                    // Telegram Bot API
                    const telegramUrl =
                        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
