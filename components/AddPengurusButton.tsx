"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddPengurusForm from "./AddPengurusForm"
import { Button } from "./ui/button"

export default function AddPengurusButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-15 right-15 bg-gray-950 hover:bg-gray-400 w-16 h-16 flex items-center justify-center text-white border border-white rounded-full shadow-lg transition-all hover:scale-110 z-50"
        >
          <Plus size={24} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle>Tambah Akun Pengurus</DialogTitle>
        </DialogHeader>

        <AddPengurusForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}