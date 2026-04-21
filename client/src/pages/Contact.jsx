import { useState } from "react";
import API from "../services/api";

export default function Contact() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    await API.post("/tickets", { subject, message });
    alert("Ticket Sent!");
  };

  return (
    <div>
      <h2>Contact SLIIT</h2>

      <input
        placeholder="Subject"
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}