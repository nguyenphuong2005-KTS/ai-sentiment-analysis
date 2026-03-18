const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

// Cho phép server đọc file ngay tại thư mục gốc
app.use(express.static(__dirname));

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
                    { role: "system", content: "Phân tích cảm xúc. Trả về JSON: {\"sentiment\": \"...\", \"confidence_percent\": 95, \"rating_score\": 5, \"ai_reply\": \"...\"}" },
                    { role: "user", content: req.body.text }
                ],
                response_format: { type: "json_object" }
            })
        });
        const data = await response.json();
        res.json(JSON.parse(data.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ error: "Lỗi AI" });
    }
});

// Mở file index.html ngay tại thư mục gốc
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));