
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditAccount.css";

function EditAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      setName(user.name || "");
      setEmail(user.email || "");
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("user");
      navigate("/", { replace: true });
      return;
    }

    if (!name.trim() || !email.trim()) {
      setMessage("Please enter your name and email.");
      setMessageType("error");
      return;
    }

    const updates = {
      name: name.trim(),
      email: email.trim(),
    };

    if (password.length > 0) {
      updates.password = password;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/update-account",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Unable to update your account.");
        setMessageType("error");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setPassword("");
      setMessage("Account updated successfully!");
      setMessageType("success");
    } catch {
      setMessage("Could not connect to the server. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="edit-account-page">
      <form
        onSubmit={handleSubmit}
        className="edit-account-card"
      >
        <h2 className="edit-account-heading">
          Edit Your Account
        </h2>

        <p className="edit-account-subtitle">
          Update your personal information below.
        </p>

        <label
          className="edit-account-label"
          htmlFor="account-name"
        >
          Full Name
        </label>

        <input
          id="account-name"
          className="edit-account-input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />

        <label
          className="edit-account-label"
          htmlFor="account-email"
        >
          Email Address
        </label>

        <input
          id="account-email"
          className="edit-account-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label
          className="edit-account-label"
          htmlFor="account-password"
        >
          New Password (optional)
        </label>

        <input
          id="account-password"
          className="edit-account-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Leave blank to keep current password"
          minLength={8}
          autoComplete="new-password"
        />

        {message && (
          <p
            className={`edit-account-message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="edit-account-save"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          className="edit-account-back"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </form>
    </main>
  );
}

export default EditAccount;
