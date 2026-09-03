import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

function Register() {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  /** @type {(event: import("react").FormEvent<HTMLFormElement>) => Promise<void>} */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsRegistering(true);
    setMessage("");

    setMessage("");

    const passwordIsValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);

    if (!passwordIsValid) {
      setPasswordError(t("passwordRequirements"));
      setIsRegistering(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : t("registrationFailed"),
        );
        return;
      }

      localStorage.setItem("access_token", data.access_token);

      navigate("/dashboard");
    } catch {
      setMessage(t("serverConnectionFailed"));
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            SmartBudget
          </h1>

          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-indigo-500"></div>

          <p className="mt-4 text-gray-500">{t("createAccount")}</p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("createAccount")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("createAccountDescription")}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("username")}
              </label>

              <input
                type="text"
                name="new-username"
                autoComplete="off"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={t("yourUsername")}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("email")}
              </label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("yourEmail")}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("password")}
              </label>

              <div>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new-password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t("password")}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {passwordError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
                  >
                    {showPassword ? t("hide") : t("show")}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {message && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {message}
              </div>
            )}

            {/* Create Account */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? t("creatingAccount") : t("createAccount")}
            </button>
          </form>

          <div className="mt-6">
            <p className="mb-3 text-center text-sm font-medium text-gray-700">
              {t("language")}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  language === "en"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                🇬🇧 English
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("fr")}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  language === "fr"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                🇫🇷 Français
              </button>
            </div>
          </div>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {t("alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              {t("login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
