"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState<string | number | null>(null);
  const [role, setRole] = useState<string | null>(null);  // Добавляем состояние для роли

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            router.push("/login");
          } else {
            throw new Error("Ошибка проверки авторизации");
          }
        } else {
          // После успешной авторизации проверяем роль
          const roleResponse = await fetch("http://localhost:4000/user/getRole", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            if (roleData.role === "ADMIN" || roleData.role === "MODER") {
              setRole(roleData.role);
            }
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Ошибка авторизации:", error);
        localStorage.removeItem("access_token");
        router.push("/login");
      }
    };

    checkAuthorization();
  }, [router]);

  const handleOperation = async (operation: "plus" | "minus") => {
    try {
      const response = await fetch(`http://localhost:4000/user/${operation}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ one: num1, two: num2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка выполнения операции.");
      }

      const data = await response.json();
      setResult(data.message);
    } catch (error: any) {
      setResult(`Ошибка: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const handleAdminPanel = () => {
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
      {/* Кнопка выхода */}
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
      >
        Выйти
      </button>

      {/* Кнопка для админ панели */}
      {role && (
        <button
          onClick={handleAdminPanel}
          className="absolute top-4 right-4 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          Admin Panel
        </button>
      )}

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Операции</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="num1" className="block text-gray-700 font-medium mb-2">
              Число 1
            </label>
            <input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Введите число"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="num2" className="block text-gray-700 font-medium mb-2">
              Число 2
            </label>
            <input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Введите число"
            />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleOperation("plus").catch(console.error)}
              className="w-full py-2 mb-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Сложить
            </button>
            <button
              type="button"
              onClick={() => handleOperation("minus").catch(console.error)}
              className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Вычесть
            </button>
          </div>

          {result !== null && (
            <div className="mt-4 text-xl font-bold">
              Результат: {result}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
