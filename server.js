const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

// DÒNG NÀY RẤT QUAN TRỌNG: Cho Vercel biết các file giao diện nằm ở đâu
app.use(express.static(path.join(__dirname, 'public')));

// API để xử lý phân tích (Giữ nguyên logic AI của bạn)
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
                    { role: "system", content: "Bạn là chuyên gia CX. Trả về JSON: {\"sentiment\": \"Tích cực/Tiêu cực/Trung lập\", \"confidence_percent\": 95, \"rating_score\": 5, \"ai_reply\": \"...\"}" },
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

// DÒNG NÀY ĐỂ HIỆN GIAO DIỆN KHI MỞ LINK:
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app; // ĐỂ VERCEL CHẠY ĐƯỢC SERVERLESS FUNCTION