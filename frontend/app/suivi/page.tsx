"use client"

import SearchBar from '@/components/macro-element/SearchBar'
import Image from 'next/image'
import { useState } from 'react'

const mockData = {
  requestNumber: 'LT/A/22/03/25/00001',
  lastName: 'ATANGANA',
  firstName: 'Jean Pierre',
  submissionDate: '22/03/2025',
  biometricsDate: '04/04/2025',
  biometricsStatus: 'en attente',
  pickupDate: 'N/A',
  status: 'En attente',
};

const StatusPage = () => {
  const [data, setData] = useState<typeof mockData | null>(null)
  const [error, setError] = useState('')

  const handleSearch = (query: string) => {
    if (query.trim() === mockData.requestNumber) {
      setData(mockData);
      setError('');
    } else {
      setData(null);
      setError("Aucune demande trouvée pour ce numéro.");
    }
  };

  return (
    <div>
      <section>
        <SearchBar onSearch={handleSearch}/>
      </section>

      <main className='flex justify-center'>
          <div className='bg-gray-100 rounded-xl shadow-lg p-6 w-full max-w-8/12 mb-8'>
            <div className='flex sm:flex-row flex-col sm:space-x-6'>
              <div className='shrink-0 mb-4 h-40 w-38 relative sm:mb-0'>
                <Image
                  src="/4.png"
                  alt='Photo du demandeur'
                  fill
                  className='rounded-lg'
                />
              </div>
              {data ? (
                <div className="flex-grow text-gray-900 ml-3">
                  <p><span className="font-semibold">N° demande:</span> <span className='font-bold'>{data.requestNumber}</span></p>
                  <p className="mt-5"><span className="font-semibold">Noms:</span> <span className='font-bold'>{data.lastName}</span> </p>
                  <p className="mt-5"><span className="font-semibold">Prénoms:</span> <span className='font-bold'>{data.firstName}</span></p>
                  <p className="mt-5"><span className="font-semibold">Date de soumission:</span> <span className='font-bold'>{data.submissionDate}</span></p>
                  <p className="mt-5 text-gray-400"><span className="font-semibold">Date de biométrie:</span> <span className='font-bold'>{data.biometricsDate}</span> ({data.biometricsStatus})</p>
                  <p className="mt-5"><span className="font-semibold">Date de retrait de la CNI:</span> <span className='font-bold'>{data.pickupDate}</span></p>
                </div>
              ) : error ? (
                <> 
                  <p className="text-red-500 font-semibold">{error}</p>
                </>
              ) : (
                <> 
                  <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                    Entrez votre numéro de demande pour afficher le statut de votre CNI.
                  </p>
                </>
              )}
            </div>
            {data && (
              <div className="mt-6 text-right text-gray-900">
                <span className="font-semibold">Statut:</span> ⏳ {data.status}
              </div>
            )}  
          </div>
      </main>
    </div>
  )
}

export default StatusPage