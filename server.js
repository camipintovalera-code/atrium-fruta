const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Página de prueba del servidor
app.get("/", (req, res) => {
  res.send("ATRIUM FRUTA - Backend funcionando");
});

// Iniciar conexión con TikTok
app.get("/auth/tiktok", (req, res) => {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    response_type: "code",
    scope: "user.info.basic,video.list",
    redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    state: "atrium-fruta"
  });

  const url =
    "https://www.tiktok.com/v2/auth/authorize/?" +
    params.toString();

  res.redirect(url);
});

// Recibir respuesta de TikTok
app.get("/auth/tiktok/callback", (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("No se recibió el código de TikTok");
  }

  res.send(`
    <h1>Conexión con TikTok</h1>
    <p>Autorización recibida correctamente.</p>
    <p>El backend está listo para continuar con la integración.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
