"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  name: {
    firstname: string;
    lastname: string;
  };
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url = "https://fakestoreapi.com/users";

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []); // Empty dependency array to run only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>User List</h1>
      <ul className='space-y-2'>
        {users.map((user) => (
          <li key={user.id} className='bg-white shadow rounded p-3'>
            {user.name.firstname} {user.name.lastname} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
