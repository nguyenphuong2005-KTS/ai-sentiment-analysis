async function analyzeSentiment() {
    const text = document.getElementById('userInput').value;
    const btn = document.getElementById('submitBtn');
    if (!text) return alert("Vui lòng nhập ý kiến!");

    btn.disabled = true;
    btn.innerHTML = "Đang phân tích...";

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();

        document.getElementById('resultArea').style.display = 'block';
        const label = document.getElementById('sentimentLabel');
        label.innerText = `${data.sentiment} (${data.confidence_percent}%)`;
        label.className = `sentiment-badge ${data.sentiment === 'Tích cực' ? 'positive' : data.sentiment === 'Tiêu cực' ? 'negative' : 'neutral'}`;
        
        document.getElementById('aiReply').innerText = data.ai_reply;
        
        let stars = '';
        for(let i=1; i<=5; i++) stars += i <= data.rating_score ? '★' : '☆';
        document.getElementById('starRating').innerText = stars;

    } catch (error) {
        alert("Lỗi kết nối server!");
    } finally {
        btn.disabled = false;
        btn.innerHTML = "PHÂN TÍCH CHIẾN LƯỢC 🚀";
    }
}