const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: `Phân tích cảm xúc ngắn gọn (Tích cực/Tiêu cực/Trung lập): ${text}` }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ message: "Lỗi API Groq: " + data.error.message });
        }
        
        res.json({ result: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
});

app.listen(3000, () => console.log("🚀 Server chạy tại http://localhost:3000"));