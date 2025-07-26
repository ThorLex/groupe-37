'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConfirmationStep() {
  const router = useRouter()

  const restart = () => {
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 p-6"
    >
      <CheckCircle size={60} className="text-green-500 mx-auto" />
      <h2 className="text-2xl font-semibold text-green-500">Pré-enrôlement réussi !</h2>
      <p className="text-white">Nous avons bien reçu vos informations. Vous recevrez un email de confirmation d&lsquo;ici peu.</p>

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          <Link href="/">Accueil</Link>
        </button>

        <button
          onClick={restart}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition cursor-pointer"
        >
          <Link href="/pre-enrolement">Nouveau pré-enrôlement</Link>
        </button>
      </div>
    </motion.div>
  )
}
