"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import EditPengurusModal from "./EditPengurusModal"

interface Pengurus {
  id: number
  name: string
  email: string
  role: string
}

interface PengurusMenuProps {
  pengurus: Pengurus
}

export default function PengurusMenu({ pengurus }: PengurusMenuProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  async function deletePengurus() {
    if (!confirm("Yakin ingin menghapus akun ini?")) return
    setLoading(true)

    await fetch(`/api/pengurus/${pengurus.id}`, {
      method: "DELETE",
    })

    window.location.reload()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-slate-600 rounded">⋮</button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-slate-800 text-slate-100 border border-slate-600">
          <DropdownMenuItem
            className="text-center hover:bg-slate-400"
            onClick={() => setShowEdit(true)}
          >
            ✏ Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={deletePengurus}
            className="text-red-400 hover:bg-red-800"
          >
            🗑 Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEdit && (
        <EditPengurusModal
          pengurus={pengurus}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
