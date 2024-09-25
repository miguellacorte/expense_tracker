// src/components/AuthCheck.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  // very basic password check, replace with a secure method in production
  const correctPassword = "abc1234"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === correctPassword) {
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Ingresar contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese la contraseña"
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  )
}