'use client'

import { useEffect, useState } from 'react'

const BASE_URL = 'http://20.84.65.157/api/'

export default function Page() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ id: null, nombre: '', email: '' })
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch(BASE_URL + 'list')
    const data = await res.json()
    setUsers(data.usuarios)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = BASE_URL + (editMode ? `edit/${form.id}` : 'create')

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(form),
    })

    setForm({ id: null, nombre: '', email: '' })
    setEditMode(false)
    fetchUsers()
  }

  const handleEdit = (user) => {
    setForm(user)
    setEditMode(true)
  }

  const handleDelete = async (id) => {
    await fetch(BASE_URL + `delete/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Name"
            value={form.nombre}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editMode ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.nombre}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
