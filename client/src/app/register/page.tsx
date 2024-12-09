"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Функция отправки формы
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Валидация
    if (!email || !password || !name) {
      setError("Пожалуйста, заполните все поля.");
      setIsLoading(false);
      return;
    }

    try {
      // Регистрация
      const registerResponse = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "Ошибка при регистрации.");
      }

      // Вход после регистрации
      const loginResponse = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Ошибка при авторизации.");
      }

      const loginData = await loginResponse.json();

      // Сохраняем токен в localStorage
      localStorage.setItem("access_token", loginData.access_token);

      // Перенаправление на главную страницу
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Регистрация</h1>
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
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Введите ваше имя"
            />
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">Уже есть аккаунт?</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-2 text-blue-500 hover:underline"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
