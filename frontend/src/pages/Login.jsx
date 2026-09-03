import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { changeLanguage, t } = useLanguage();

  const handleSubmit = async (
    /** @type {React.FormEvent<HTMLFormElement>} */ event,
  ) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setMessage("");

    try {
      // 1. Login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string" ? data.detail : t("loginFailed"),
        );
        return;
      }

      // 2. Save JWT
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // 3. Get current user's information
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/users/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setMessage(
          typeof userData.detail === "string"
            ? userData.detail
            : t("userInfoFailed"),
        );
        return;
      }

      // 4. Set the user's language
      if (userData.language === "fr" || userData.language === "en") {
        changeLanguage(userData.language);
      }

      // 5. Go to Dashboard
      setMessage(t("loginSuccessful"));
      navigate("/dashboard");
    } catch {
      setMessage(t("serverConnectionFailed"));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            SmartBudget
          </h1>

          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-indigo-500"></div>

          <p className="mt-4 text-gray-500">{t("login")}</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">{t("login")}</h2>

          <p className="mt-1 text-sm text-gray-500">{t("loginToContinue")}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("email")}
              </label>

              <input
                type="email"
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

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("password")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
                >
                  {showPassword ? t("hide") : t("show")}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? t("loggingIn") : t("login")}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {t("dontHaveAccount")}{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              {t("createAccount")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
