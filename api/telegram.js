export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { name, prize } = req.body || {};

    if (!name || !prize) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap"
      });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        success: false,
        message: "BOT_TOKEN atau CHAT_ID belum diatur"
      });
    }

    const message = `🎁 HASIL RODA

Nama: ${name}
Hadiah: ${prize}`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return res.status(500).json({
        success: false,
        message: "Telegram gagal menerima pesan"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
    });
  }
}
