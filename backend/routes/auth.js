import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const router = express.Router();

router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.state = state;

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/authorize`,
    response_type: "code",
    scope: "identify email",
    state: state,
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

router.get("/authorize", async (req, res) => {
  if (req.query.state !== req.session.state) {
    return res.status(400).json({ error: "State mismatch" });
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: `${process.env.BASE_URL}/api/authorize`,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const tokenData = await tokenResponse.json();
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();

    const token = jwt.sign(
      {
        user_id: userData.id,
        username: userData.username,
        email: userData.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    delete req.session.state;

    res
      .cookie("token", token, { httpOnly: true, secure: true })
      .redirect("/callback");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;