'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { User } from '../types/user'

function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function resetForm() {
    setEmail('')
    setName('')
    setSelectedId(null)
  }

  async function fetchUsers() {
    const res = await fetch('/api/users')
    const data = await res.json()

    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function createUser() {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
      }),
    })

    if (res.ok) {
      fetchUsers()
      resetForm()
    }
  }

  async function updateUser() {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedId,
        email,
        name,
      }),
    })

    if (res.ok) {
      fetchUsers()
      resetForm()
    }
  }

  async function deleteUser(userId: number) {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userId,
      }),
    })

    if (res.ok) {
      fetchUsers()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          className={styles.inputField}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
        />
        <button className={styles.button} onClick={createUser}>
          Create User
        </button>
        {selectedId && (
          <button className={styles.button} onClick={updateUser}>
            Update User
          </button>
        )}
      </div>
      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user.id} className={styles.userItem}>
            ID: {user.id}, {user.email} - {user.name}
            <button
              className={styles.button}
              onClick={() => {
                setSelectedId(user.id)
                setEmail(user.email)
                setName(user.name || '')
              }}
            >
              Select
            </button>
            <button className={styles.button} onClick={() => deleteUser(user.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
