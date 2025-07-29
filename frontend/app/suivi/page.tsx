"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchBar from '@/components/macro-element/SearchBar'

interface StatusData {
  idDemande: string
  lastName: string
  firstName: string
  initiationDate: string
  biometricDate?: string
  locationCNI?: string
  status: string
  biometricPass?: string
  rejectionReason?: string
  photoUrl?: string
}

const StatusPage = () => {
  const [data, setData] = useState<StatusData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setImageLoading(true)
  }, [data])

  const handleSearch = async (query: string) => {
    setLoading(true)
    setError('')
    setData(null)

    try {
      const response = await fetch(`/api/track?id=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la recherche de la demande')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'available': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'approved': return 'Approuvée'
      case 'rejected': return 'Rejetée'
      case 'available': return 'Disponible'
      default: return status
    }
  }

  return (
    <div>
      <section>
        <SearchBar 
          onSearch={handleSearch} 
          loading={loading} 
        />
      </section>

      <main className='flex justify-center'>
        <div className='bg-gray-100 rounded-xl shadow-lg p-6 w-full max-w-11/12 md:max-w-8/12 mb-8'>
          <div className='flex sm:flex-row flex-col sm:space-x-6 max-sm:items-center'>
            <div className='shrink-0 mb-4 h-40 w-38 relative sm:mb-0'>
              {/* Loader pendant le chargement de l'image */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              )}
              
              {/* Image dynamique avec gestion de chargement */}
              {data?.photoUrl ? (
                <Image
                  src={data.photoUrl}
                  alt='Photo du demandeur'
                  fill
                  className={`rounded-lg object-cover ${imageLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                  onLoadingComplete={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              ) : (
                <Image
                  src="/4.png"
                  alt='Photo par défaut'
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </div>
            
            {data ? (
              <div className="flex-grow text-gray-900 sm:ml-3">
                <p>
                  <span className="font-semibold">N° demande:</span> 
                  <span className='font-bold ml-2'>{data.idDemande}</span>
                </p>
                
                <p className="mt-5">
                  <span className="font-semibold">Noms:</span> 
                  <span className='font-bold ml-2'>{data.lastName}</span>
                </p>
                
                <p className="mt-5">
                  <span className="font-semibold">Prénoms:</span> 
                  <span className='font-bold ml-2'>{data.firstName}</span>
                </p>
                
                <p className="mt-5">
                  <span className="font-semibold">Date de soumission:</span> 
                  <span className='font-bold ml-2'>{data.initiationDate}</span>
                </p>
                
                {data.biometricDate && (
                  <p className="mt-5">
                    <span className="font-semibold">Date de biométrie:</span> 
                    <span className='font-bold ml-2'>{data.biometricDate}</span>
                  </p>
                )}
                
                {data.locationCNI && (
                  <p className="mt-5">
                    <span className="font-semibold">Lieu de retrait:</span> 
                    <span className='font-bold ml-2'>{data.locationCNI}</span>
                  </p>
                )}
                
                {data.status === 'rejected' && data.rejectionReason && (
                  <div className="mt-5 p-3 bg-red-50 rounded-md">
                    <p className="font-semibold text-red-800">Motif de rejet:</p>
                    <p className="text-red-700">{data.rejectionReason}</p>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-red-500 font-semibold text-lg">{error}</p>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-gray-600 text-lg">
                  Entrez votre numéro de demande pour afficher le statut de votre CNI
                </p>
              </div>
            )}
          </div>
          
          {data && (
            <div className="mt-6 flex justify-between items-center">
              {data.biometricPass && (
                <div>
                  <span className="font-semibold">Statut biométrie:</span>
                  <span className="ml-2 font-bold">
                    {data.biometricPass === 'pending' && '⏳ En attente'}
                    {data.biometricPass === 'passed' && '✅ Réussie'}
                    {data.biometricPass === 'not assignable' && '❌ Non programmée'}
                  </span>
                </div>
              )}
              
              <div>
                <span className="font-semibold">Statut demande:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
                  {translateStatus(data.status)}
                </span>
              </div>
            </div>
          )}
          
          {data?.status === 'available' && data.locationCNI && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <p className="font-medium text-green-800">Votre CNI est disponible !</p>
              <p className="mt-1 text-green-700">
                Vous pouvez retirer votre carte d&lsquo;identité à {data.locationCNI}.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <div className="text-center mt-6">
        <button 
          onClick={() => router.push('/pre-enrolement')}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-lg"
        >
          Faire une nouvelle demande
        </button>
      </div>
    </div>
  )
}

export default StatusPage