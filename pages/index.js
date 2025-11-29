import { useState, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    async function fetchSignatures() {
      const res = await fetch("/api/signatures");
      const data = await res.json();
      setSignatures(data);
    }
    fetchSignatures();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/signatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    const newSig = await res.json();
    setSignatures([...signatures, newSig]);
    setName("");
    setMessage("");
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      
      {/* 🔥 The Greeting Card Image */}
      <img 
        src="/ecard.jpg"
        alt="Thank You Card"
        style={{ width: "100%", borderRadius: "10px", marginBottom: "30px" }}
      />

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Add Your Message
      </h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          required
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <label>Message</label>
        <textarea
          value={message}
          required
          placeholder="Write a short message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: "10px", height: "120px" }}
        />

        <button 
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add to Card
        </button>
      </form>

      <hr />

      <h2 style={{ marginBottom: "20px" }}>Messages</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {signatures.map((sig, index) => (
          <li
            key={index}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              background: "#fafafa"
            }}
          >
            <strong>{sig.name}:</strong> {sig.message}
          </li>
        ))}
      </ul>

    </div>
  );
}
