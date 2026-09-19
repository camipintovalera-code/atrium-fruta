const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;

const WEBSITE_URL = "https://camipintovalera-code.github.io/atrium-fruta/";

const states = new Set();



/* ---------------------------------
INICIO
---------------------------------- */

app.get("/", (req, res) => {
res.send("ATRIUM FRUTA - Backend funcionando");
});

/* ---------------------------------
CONEXIÓN CON TIKTOK
---------------------------------- */

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

res.redirect(
"https://www.tiktok.com/v2/auth/authorize/?" +
params.toString()
);

});

/* ---------------------------------
CALLBACK DE TIKTOK
---------------------------------- */

app.get("/auth/tiktok/callback", async (req, res) => {

const {
code,
state,
error,
error_description
} = req.query;

if (error) {


return res.status(400).send(
  "TikTok rechazó la autorización: " +
  (error_description || error)
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
      "Content-Type":
        "application/x-www-form-urlencoded"
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

const { error: saveError } = await supabase
  .from("tiktok_tokens")
  .upsert({
    id: 1,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in * 1000),
    refresh_expires_at: data.refresh_expires_in
      ? Date.now() + (data.refresh_expires_in * 1000)
      : null,
    updated_at: new Date().toISOString()
  });

if (saveError) {

  console.error("Error guardando token en Supabase:", saveError);

  return res.status(500).send(
    "TikTok autorizó la cuenta, pero no se pudo guardar la autorización."
  );

}


/* ---------------------------------
   COMPROBAR QUE LOS VIDEOS FUNCIONAN
---------------------------------- */

const videoResponse = await fetch(
  "https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,share_url,duration,create_time",
  {
    method: "POST",

    headers: {
      "Authorization":
        `Bearer ${data.access_token}`,

      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      max_count: 20
    })
  }
);

const videoData = await videoResponse.json();

console.log(
  "Respuesta de videos:",
  videoData
);

if (
  !videoResponse.ok ||
  videoData.error?.code !== "ok"
) {

  return res.status(400).send(
    "Autorización exitosa, pero no se pudieron consultar los videos."
  );

}


/* ---------------------------------
   REGRESAR AUTOMÁTICAMENTE A LA WEB
---------------------------------- */

res.redirect(
  WEBSITE_URL + "?tiktok=connected"
);


} catch (error) {


console.error(error);

res.status(500).send(
  "Error interno del servidor."
);


}

});

/* ---------------------------------
API DE VIDEOS
---------------------------------- */

app.get("/api/tiktok/videos", async (req, res) => {

const accessToken = latestAccessToken;
const { data: tokenData, error: tokenError } = await supabase
  .from("tiktok_tokens")
  .select("access_token")
  .eq("id", 1)
  .single();

if (tokenError || !tokenData?.access_token) {

  return res.status(400).json({
    error: "Falta el access_token"
  });

}

const accessToken = tokenData?.access_token;

try {


const fields = [
  "id",
  "title",
  "cover_image_url",
  "share_url",
  "duration",
  "create_time"
].join(",");


const response = await fetch(
  `https://open.tiktokapis.com/v2/video/list/?fields=${fields}`,
  {
    method: "POST",

    headers: {
      "Authorization":
        `Bearer ${accessToken}`,

      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      max_count: 20
    })
  }
);


const data = await response.json();


if (
  !response.ok ||
  data.error?.code !== "ok"
) {

  return res
    .status(400)
    .json(data);

}


res.json(data);


} catch (error) {


console.error(error);

res.status(500).json({
  error: "Error interno del servidor"
});


}

});

/* ---------------------------------
SERVIDOR
---------------------------------- */

app.listen(PORT, () => {

console.log(
`Servidor ejecutándose en el puerto ${PORT}`
);

});
