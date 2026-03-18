const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Cực kỳ quan trọng để sửa lỗi "Cannot GET /"

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
                messages: [{
                    role: "system",
                    content: "Bạn là chuyên gia phân tích cảm xúc khách hàng. Hãy trả về kết quả dưới dạng JSON: { \"sentiment\": \"Tích cực/Tiêu cực/Trung lập\", \"reply\": \"Một câu phản hồi lịch sự cho khách hàng\" }"
                }, {
                    role: "user",
                    content: req.body.text
                }],
                response_format: { type: "json_object" }
            })
        });
        const data = await response.json();
        res.json(JSON.parse(data.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ error: "Lỗi AI" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));