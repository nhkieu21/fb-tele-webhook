const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = '8596908965:AAGeA_AGMLqXXbpJeMPkLzfgt524odyrYlg';
const CHAT_ID = '7460562625';

// Xác thực Webhook với Facebook
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === 'Nhukieu172.') {
        res.status(200).send(challenge);
    } else {
        res.status(403).end();
    }
});

// Nhận tin nhắn và đẩy về Telegram
app.post('/webhook', (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            let webhook_event = entry.messaging[0];
            let sender_id = webhook_event.sender.id;
            let message_text = webhook_event.message.text;

            // Gửi qua Telegram
            axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: `🔔 Tin nhắn mới từ khách (${sender_id}):\n"${message_text}"`
            });
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook is listening on port ${PORT}...`));
