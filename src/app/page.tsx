"use client";
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, X, Eye } from 'lucide-react'

// Define types for Expenses and Participants
type Expense = {
  id: number
  description: string
  price: number
  paidBy: string
  sharedWith: string[]
  receipts: UploadedFile[]
}

type Participant = string

type UploadedFile = {
  id: number
  name: string
  size: number
  url: string
}

export default function ExpenseCollection() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [participants] = useState<Participant[]>(['Ada', 'John', 'Wicko']) // Static participants
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    description: '',
    price: 0,
    paidBy: participants[0], // Default to the first participant
    sharedWith: [],
    receipts: []
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  // Function to calculate balances
  const calculateBalances = () => {
    const balances: { [key: string]: number } = {}
    participants.forEach(p => balances[p] = 0)

    expenses.forEach(expense => {
      const involvedParticipants = [expense.paidBy, ...expense.sharedWith]
      const pricePerPerson = expense.price / involvedParticipants.length

      balances[expense.paidBy] += expense.price - pricePerPerson
      expense.sharedWith.forEach(p => {
        balances[p] -= pricePerPerson
      })
    })

    return balances
  }

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const file = files[0]
      setUploadStatus('Uploading file...')
      console.log('File ready for upload:', file.name)

      // Simulate file upload and create a temporary URL
      const fakeUrl = URL.createObjectURL(file)
      setNewExpense(prevExpense => ({
        ...prevExpense,
        receipts: [{
          id: Date.now(),
          name: file.name,
          size: file.size,
          url: fakeUrl
        }]
      }))

      setUploadStatus('File uploaded successfully!')
      setTimeout(() => setUploadStatus(''), 3000) // Clear status after 3 seconds
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Function to add new expense
  const addExpense = () => {
    if (newExpense.description && newExpense.price > 0) {
      setExpenses(prevExpenses => [
        ...prevExpenses,
        { ...newExpense, id: Date.now() }
      ])

      // Clear the form for the next expense
      setNewExpense({
        description: '',
        price: 0,
        paidBy: participants[0],
        sharedWith: [],
        receipts: []
      })

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      alert('Expense added successfully')
    } else {
      alert('Please fill in all required fields')
    }
  }

  // Function to view the uploaded file (simulated PDF)
  const viewPDF = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Expense Collection</h1>
      <p className="text-gray-600 mb-6 italic">Insert description here!</p>
     
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newExpense.price}
                onChange={(e) => setNewExpense({...newExpense, price: parseFloat(e.target.value)})}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select
                value={newExpense.paidBy}
                onValueChange={(value) => setNewExpense({...newExpense, paidBy: value})}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Shared With</Label>
              <div className="col-span-2 space-y-2">
                {participants.filter(p => p !== newExpense.paidBy).map((p) => (
                  <div key={p} className="flex items-center space-x-2">
                    <Checkbox
                      id={`shared-${p}`}
                      checked={newExpense.sharedWith.includes(p)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewExpense({...newExpense, sharedWith: [...newExpense.sharedWith, p]})
                        } else {
                          setNewExpense({...newExpense, sharedWith: newExpense.sharedWith.filter(x => x !== p)})
                        }
                      }}
                    />
                    <Label htmlFor={`shared-${p}`}>{p}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Upload Receipts</Label>
              <div className="col-span-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                  aria-label="Upload PDF files"
                />
                <Button 
                  onClick={triggerFileUpload} 
                  variant="secondary" 
                  size="sm" 
                  className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload expense receipt
                </Button>
                {uploadStatus && (
                  <p className="mt-2 text-sm text-blue-600">{uploadStatus}</p>
                )}
                {newExpense.receipts.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold mb-1">Uploaded Files:</h3>
                    <ul className="text-sm">
                      {newExpense.receipts.map((file) => (
                        <li key={file.id} className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={addExpense}>Add Expense</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between items-start border-b pb-2">
                <div className="flex-grow pr-4">
                  <p className="font-semibold">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    ${expense.price.toFixed(2)} (Paid by {expense.paidBy}, 
                    Shared with {expense.sharedWith.join(', ')})
                  </p>
                </div>
                {expense.receipts.length > 0 && (
                    <div className="mt-1">
                      {expense.receipts.map((file) => (
                        <Button
                          key={file.id}
                          variant="outline"
                          size="sm"
                          className="mr-2 mt-1"
                          onClick={() => viewPDF(file.url)}
                        >
                          <Eye className="mr-1 h-4 w-4" /> View PDF
                        </Button>
                      ))}
                  
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Object.entries(calculateBalances()).map(([person, balance]) => (
              <li key={person} className="flex justify-between items-center">
                <span>{person}</span>
                <span className={balance > 0 ? 'text-green-600' : 'text-red-600'}>
                  ${Math.abs(balance).toFixed(2)} {balance > 0 ? 'to receive' : 'to pay'}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}