import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===== FRONTEND SERVED FROM SAME FILE ===== */

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>DIY AI App</title>
<style>
body{font-family:Arial;background:#f5f9ff;margin:0}
header{padding:15px;background:white;color:#2563eb;font-weight:bold}
.container{padding:20px}
textarea{width:100%;padding:10px}
button{width:100%;padding:10px;background:#2563eb;color:white;border:none}
.box{margin-top:10px;background:white;padding:10px;border-radius:10px}
</style>
</head>
<body>

<header>DIY AI App</header>

<div class="container">

<h3>Ask AI</h3>

<textarea id="q"></textarea>

<button onclick="askAI()">Send</button>

<div class="box" id="out">Ready</div>

</div>

<script>
async function askAI(){

  const q = document.getElementById("q").value;
  const out = document.getElementById("out");

  out.innerText = "Thinking...";

  const res = await fetch("/api/ai", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({message:q})
  });

  const data = await res.json();
  out.innerText = data.reply;

}
</script>

</body>
</html>
  `);
});

/* ===== AI BACKEND ===== */

app.post("/api/ai", async (req, res) => {

  const message = req.body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful DIY tutor." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();

  res.json({
    reply: data.choices?.[0]?.message?.content || "No response"
  });

});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
