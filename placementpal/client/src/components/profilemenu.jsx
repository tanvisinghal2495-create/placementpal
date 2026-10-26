
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profilemenu.css";

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  const initial =
    user?.name?.trim()?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-container" ref={menuRef}>
      <button
        type="button"
        className="profile-avatar"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        {initial}
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <div className="profile-avatar profile-avatar-small">
              {initial}
            </div>

            <div className="profile-details">
              <h4>{user?.name || "User"}</h4>
              <p>{user?.email || "No email available"}</p>
            </div>
          </div>

          <div className="profile-divider" />

          <button
            type="button"
            className="profile-option"
            onClick={() => {
              setIsOpen(false);
              navigate("/edit-account");
            }}
          >
            <span>✎</span>
            Edit your account
          </button>

          <button
            type="button"
            className="profile-option logout-option"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
