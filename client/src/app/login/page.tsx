"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Произошла ошибка при входе.");
      }

      const data = await response.json();
      console.log("Успешная авторизация:", data);

      // Сохраняем access_token в localStorage
      localStorage.setItem("access_token", data.access_token);

      setSuccessMessage("Вы успешно вошли!");

      setEmail("");
      setPassword("");

      // Перенаправление на главную страницу
      router.push("/home");
    } catch (err: any) {
      console.error("Ошибка авторизации:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Авторизация</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Введите ваш email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Введите ваш пароль"
            />
          </div>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          {successMessage && <div className="mb-4 text-green-500 text-sm">{successMessage}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? "Загрузка..." : "Войти"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">Еще нет аккаунта?</p>
          <button
            onClick={() => router.push("/register")}
            className="mt-2 text-blue-500 hover:underline"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}
