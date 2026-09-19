
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;

const states = new Set();

app.get("/", (req, res) => {
  res.send("ATRIUM FRUTA - Backend funcionando");
});
app.get("/debug/tiktok", (req, res) => {
  res.json({
    clientKeyLoaded: !!CLIENT_KEY,
    clientKeyLength: CLIENT_KEY ? CLIENT_KEY.length : 0,
    clientSecretLoaded: !!CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  });
});

app.get("/auth/tiktok", (req, res) => {
  const state = crypto.randomBytes(24).toString("hex");
  states.add(state);

  const params = new URLSearchParams({
    client_key: CLIENT_KEY,
    response_type: "code",
    scope: "user.info.basic,video.list",
    redirect_uri: REDIRECT_URI,
    state: state
  });

  console.log("TikTok Client Key cargado:", CLIENT_KEY);
console.log("TikTok Redirect URI:", REDIRECT_URI);
  res.redirect(
    "https://www.tiktok.com/v2/auth/authorize/?" +
    params.toString()
  );
});

app.get("/auth/tiktok/callback", async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(
      `TikTok rechazó la autorización: ${error_description || error}`
    );
  }

  if (!code || !state || !states.has(state)) {
    return res.status(400).send(
      "Autorización inválida o sesión expirada."
    );
  }

  states.delete(state);

  try {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_key: CLIENT_KEY,
          client_secret: CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI
        })
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Error de TikTok:", data);
      return res.status(400).send(
        "No se pudo completar la autorización con TikTok."
      );
    }

    res.send(`
      <h1>Conexión con TikTok exitosa</h1>
      <p>La autorización fue recibida correctamente.</p>
      <p>El token fue obtenido en el servidor.</p>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
