const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/webhook', async (req, res) => {
    try {
        const events = req.body.events;
        for (let event of events) {
            if (event.type === 'message' && event.message.type === 'text') {
                const userMessage = event.message.text;
                
                const telegramUrl = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;
                await axios.post(telegramUrl, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: 📢 มีข้อความจาก LINE:\n\n${userMessage}
                });
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
