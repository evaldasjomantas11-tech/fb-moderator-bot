import axios from "axios";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "12345";
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified");
      return res.status(200).send(challenge);
    } else {
      console.log("Webhook verification failed");
      return res.status(403).send("Verification failed");
    }
  }

  if (req.method === "POST") {
    try {
      await axios.post(MAKE_WEBHOOK_URL, req.body);
      return res.status(200).send("OK");
    } catch (error) {
      console.error("Error forwarding to Make.com:", error);
      return res.status(500).send("Error forwarding to Make.com");
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
