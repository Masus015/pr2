"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);  // Добавляем состояние для роли
  const [isLoading, setIsLoading] = useState(true);

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
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/apanel/getAllUsers");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  };

  useEffect(() => {
    checkAuthorization();
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }


  const handleDelete = async (id: string) => {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error("ID должен быть числом");
      }
      await fetch(`http://localhost:4000/apanel/${numericId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };
  const handleEditUser = async (id: string, field: string, value: string) => {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error("ID должен быть числом");
      }
      const response = await fetch(`http://localhost:4000/apanel/${numericId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: value,
        }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, [field]: value } : user
          )
        );
      } else {
        const errorText = await response.text(); // читаем тело ошибки (если оно есть)
        console.error("Ошибка при обновлении пользователя:", response.status, errorText);
        throw new Error(`Ошибка: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error("Ошибка при редактировании пользователя:", error);
    }
  };
  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/apanel/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setIsModalOpen(false);
      } else {
        throw new Error("Ошибка при добавлении пользователя.");
      }
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Боковое меню */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Админ панель</h1>
        <ul>
          <li className="mb-4">
            <button
              onClick={() => setCurrentPage("home")}
              className="w-full text-left text-lg hover:bg-gray-700 py-2 px-4 rounded"
            >
              Главная
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setCurrentPage("users")}
              className="w-full text-left text-lg hover:bg-gray-700 py-2 px-4 rounded"
            >
              Пользователи
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setCurrentPage("settings")}
              className="w-full text-left text-lg hover:bg-gray-700 py-2 px-4 rounded"
            >
              Настройки
            </button>
          </li>
        </ul>
      </div>

      {/* Контент справа */}
      <div className="flex-1 p-8">
        {currentPage === "home" && <div className="text-xl">Главная</div>}
        {currentPage === "settings" && <div className="text-xl">Настройки</div>}
        {currentPage === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Пользователи</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Добавить пользователя
              </button>
            </div>

            <table className="w-full table-auto border-collapse">
              <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
              </thead>
              <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={user.email}
                      onChange={(e) =>
                        handleEditUser(user.id, "email", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        handleEditUser(user.id, "name", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleEditUser(user.id, "role", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MODER">MODER</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">{user.createdAt}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white py-1 px-4 rounded"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            <button
              onClick={() => fetchUsers()}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
            >
              Обновить список
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно для добавления пользователя */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Добавить пользователя</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Имя</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Пароль</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Роль</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MODER">MODER</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Добавить
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
