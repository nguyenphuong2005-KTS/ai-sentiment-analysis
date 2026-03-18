const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

// Phục vụ các file tĩnh (css, js) trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// API phân tích cảm xúc
app.post('/analyze', async (req, res) => {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Bạn là chuyên gia phân tích cảm xúc. Trả về JSON: {\"sentiment\": \"...\", \"reply\": \"...\"}" },
                    { role: "user", content: req.body.text }
                ],
                response_format: { type: "json_object" }
            })
        });
        const data = await response.json();
        res.json(JSON.parse(data.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ error: "Lỗi kết nối AI" });
    }
});

// Quan trọng: Trả về file index.html cho mọi đường dẫn khác
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app; // Dòng này giúp Vercel hiểu và chạy nhanh hơn