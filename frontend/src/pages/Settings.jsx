import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { apiFetch } from "../api";

function Settings() {
  const { language, changeLanguage, t } = useLanguage();

  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiFetch("/users/me");

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    setEditUsername(user?.username || "");
    setEditEmail(user?.email || "");

    setProfileSuccessMessage("");
    setProfileErrorMessage("");

    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    setProfileSuccessMessage("");
    setProfileErrorMessage("");

    const trimmedUsername = editUsername.trim();
    const trimmedEmail = editEmail.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      setProfileErrorMessage(t("invalidUsername"));
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setProfileErrorMessage(t("invalidEmail"));
      return;
    }

    try {
      // Update username
      const usernameResponse = await apiFetch(
        `/users/me/username?username=${encodeURIComponent(trimmedUsername)}`,
        {
          method: "PUT",
        },
      );

      const usernameData = await usernameResponse.json();

      if (!usernameResponse.ok) {
        setProfileErrorMessage(
          usernameData.detail || t("usernameUpdateFailed"),
        );
        return;
      }

      // Update email
      const emailResponse = await apiFetch(
        `/users/me/email?email=${encodeURIComponent(trimmedEmail)}`,
        {
          method: "PUT",
        },
      );

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        setProfileErrorMessage(emailData.detail || t("emailUpdateFailed"));
        return;
      }

      // Update the displayed user
      setUser((prev) => ({
        ...prev,
        username: usernameData.username,
        email: emailData.email,
      }));

      setIsEditingProfile(false);
      setProfileSuccessMessage(t("profileUpdated"));
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileErrorMessage(t("profileUpdateFailed"));
    }
  };
  const handleLanguageChange = async (newLanguage) => {
    // Change the language immediately in the frontend
    changeLanguage(newLanguage);

    try {
      const response = await apiFetch(
        `/users/me/language?language=${newLanguage}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update language");
      }

      console.log("Language saved to database");
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";

    if (password.length < 8) {
      return "weak";
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return "strong";
    }

    return "medium";
  };

  const handleChangePassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("passwordsDoNotMatch"));
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage(t("fillAllFields"));
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(t("passwordTooShort"));
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage(t("passwordNeedsUppercase"));
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setErrorMessage(t("passwordNeedsLowercase"));
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage(t("passwordNeedsNumber"));
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await apiFetch(
        `/users/me/password?current_password=${encodeURIComponent(
          currentPassword,
        )}&new_password=${encodeURIComponent(newPassword)}`,
        {
          method: "PUT",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          data.detail ===
          "New password must be different from the current password"
        ) {
          setErrorMessage(t("samePassword"));
        } else {
          setErrorMessage(data.detail || t("passwordChangeFailed"));
        }

        return;
      }

      setSuccessMessage(t("passwordChanged"));

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength("");
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage(t("passwordChangeFailed"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("settings")}</h1>

      <p className="mt-2 text-gray-500">{t("managePreferences")}</p>

      {/* Account */}
      <div className="mt-8 max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("account")}
          </h2>

          {!isEditingProfile && (
            <button
              type="button"
              onClick={handleEditProfile}
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              {t("editProfile")}
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              {t("username")}
            </label>

            {isEditingProfile ? (
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            ) : (
              <p className="mt-1 text-gray-900">
                {user ? user.username : "..."}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              {t("email")}
            </label>

            {isEditingProfile ? (
              <div>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 ${
                    editEmail.trim() === ""
                      ? "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)
                        ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                        : "border-red-400 focus:border-red-500 focus:ring-red-100"
                  }`}
                />

                {editEmail.trim() !== "" &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail) && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      ✕ {t("invalidEmail")}
                    </p>
                  )}

                {editEmail.trim() !== "" &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail) && (
                    <p className="mt-1 text-xs font-medium text-green-600">
                      ✓ {t("validEmail")}
                    </p>
                  )}
              </div>
            ) : (
              <p className="mt-1 text-gray-900">{user ? user.email : "..."}</p>
            )}
          </div>

          {isEditingProfile && (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={
                  editUsername.trim().length < 3 ||
                  !editEmail.trim() ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)
                }
                className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("save")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfileSuccessMessage("");
                  setProfileErrorMessage("");
                }}
                className="rounded-xl bg-gray-100 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200"
              >
                {t("cancel")}
              </button>
            </div>
          )}

          {profileSuccessMessage && (
            <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✓ {profileSuccessMessage}
            </div>
          )}

          {profileErrorMessage && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              ✕ {profileErrorMessage}
            </div>
          )}
        </div>
      </div>
      {/* Language */}
      <div className="mt-6 max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">{t("language")}</h2>

        <p className="mt-1 text-sm text-gray-500">
          {t("chooseLanguageDescription")}
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            className={`px-5 py-2.5 rounded-xl font-medium transition ${
              language === "en"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("english")}
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange("fr")}
            className={`px-5 py-2.5 rounded-xl font-medium transition ${
              language === "fr"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("french")}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">{t("security")}</h2>

        <p className="mt-1 text-sm text-gray-500">
          {t("changePasswordDescription")}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
          className="mt-5 space-y-4"
        >
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("currentPassword")}
            </label>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-20 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-indigo-600"
              >
                {showCurrentPassword ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("newPassword")}
            </label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword(value);
                  setPasswordStrength(getPasswordStrength(value));
                }}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-20 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-indigo-600"
              >
                {showNewPassword ? t("hide") : t("show")}
              </button>
            </div>

            {/* Password Strength */}
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex gap-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      passwordStrength === "weak"
                        ? "bg-red-400"
                        : passwordStrength === "medium"
                          ? "bg-yellow-400"
                          : "bg-green-500"
                    }`}
                  ></div>

                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      passwordStrength === "medium"
                        ? "bg-yellow-400"
                        : passwordStrength === "strong"
                          ? "bg-green-500"
                          : "bg-gray-200"
                    }`}
                  ></div>

                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      passwordStrength === "strong"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>

                <p
                  className={`mt-1 text-xs font-medium ${
                    passwordStrength === "weak"
                      ? "text-red-500"
                      : passwordStrength === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {passwordStrength === "weak"
                    ? t("weakPassword")
                    : passwordStrength === "medium"
                      ? t("mediumPassword")
                      : t("strongPassword")}
                </p>
              </div>
            )}

            {/* Password Requirements */}
            <div className="mt-3 space-y-1 text-xs">
              <p
                className={
                  newPassword.length >= 8 ? "text-green-600" : "text-gray-500"
                }
              >
                {newPassword.length >= 8 ? "✓" : "•"} {t("passwordMinLength")}
              </p>

              <p
                className={
                  /[A-Z]/.test(newPassword) ? "text-green-600" : "text-gray-500"
                }
              >
                {/[A-Z]/.test(newPassword) ? "✓" : "•"} {t("passwordUppercase")}
              </p>

              <p
                className={
                  /[a-z]/.test(newPassword) ? "text-green-600" : "text-gray-500"
                }
              >
                {/[a-z]/.test(newPassword) ? "✓" : "•"} {t("passwordLowercase")}
              </p>

              <p
                className={
                  /[0-9]/.test(newPassword) ? "text-green-600" : "text-gray-500"
                }
              >
                {/[0-9]/.test(newPassword) ? "✓" : "•"} {t("passwordNumber")}
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("confirmPassword")}
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-20 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-indigo-600"
              >
                {showConfirmPassword ? t("hide") : t("show")}
              </button>
            </div>

            {confirmPassword && (
              <p
                className={`mt-2 text-xs font-medium ${
                  confirmPassword === newPassword
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {confirmPassword === newPassword
                  ? `✓ ${t("passwordsMatch")}`
                  : `✕ ${t("passwordsDoNotMatch")}`}
              </p>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✓ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              ✕ {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={
                isChangingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isChangingPassword ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {t("changingPassword")}
                </span>
              ) : (
                t("changePassword")
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordStrength("");
                setSuccessMessage("");
                setErrorMessage("");
              }}
              className="mt-2 rounded-xl bg-gray-100 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200"
            >
              {t("clear")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Settings;
