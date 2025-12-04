import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/predict";

function App() {
  const [form, setForm] = useState({
    subject: "",
    goal: "",
    reason: "",
    requestor: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const payload = {
      subject: form.subject,
      goal: form.goal,
      reason: form.reason,
      country: "Unknown",
      target_group: "Unknown",
      technology: null,
      requestor: form.requestor,
      status: "New",
      development_hours: null,
      closing_date: null,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setStatus("success");
      setForm({ subject: "", goal: "", reason: "", requestor: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Submit a demand in our PowerPlatform Team</h1>
        <p>Please describe your request. Our system will review it and you will receive a response within 5 business days.</p>
      </header>

      <main className="app-main">
        <form className="card form" onSubmit={handleSubmit}>

          <div className="field">
            <label>User Full Name</label>
            <input
              name="requestor"
              value={form.requestor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>What are you trying to achieve?</label>
            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="field">
            <label>Why are you looking into it?</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit request"}
          </button>

          {status === "success" && (
            <p className="message success">
              Thank you! Your request has been submitted.
            </p>
          )}

          {status === "error" && (
            <p className="message error">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

export default App;
