let signatures = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(signatures);
  }

  if (req.method === "POST") {
    const { name, message } = req.body;

    const newSignature = {
      id: Date.now(),
      name,
      message,
    };

    signatures.push(newSignature);

    return res.status(200).json(newSignature);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
