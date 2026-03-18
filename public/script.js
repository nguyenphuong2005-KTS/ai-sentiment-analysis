document.getElementById('analyzeBtn').onclick = async () => {
    const text = document.getElementById('userInput').value;
    const resDiv = document.getElementById('aiResponse');
    const resultBox = document.getElementById('resultBox');

    if(!text) return alert("Nhập nội dung!");
    
    document.getElementById('loader').classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        
        if (response.ok) {
            resDiv.innerText = data.result;
            resultBox.classList.remove('hidden');
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (e) {
        alert("Không thể kết nối Server!");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
};