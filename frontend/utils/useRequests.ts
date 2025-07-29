// import { useState, useEffect } from "react";
// import { Request } from "./types";

// export const useRequests = (date: Date) => {
//   const [data, setData] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);

//     setTimeout(() => {
//       if (!mounted) return;
//       setData([
//         {
//           id: 'CNI-20230618-001',
//           fullName: 'Jean Dupont',
//           cinNumber: '12345678',
//           status: 'pending',
//           createdAt: '2023-06-18T09:30:00Z',
//           birthDate: '1985-05-15',
//           birthPlace: 'Paris',
//           address: '12 Rue de la République, 75001 Paris',
//           reason: 'Première demande',
//           documents: [
//             { type: 'Photo d\'identité', url: '/documents/photo.jpg' },
//             { type: 'Justificatif de domicile', url: '/documents/proof.pdf' }
//           ]
//         },
//         {
//           id: 'CNI-20230618-002',
//           fullName: 'Marie Martin',
//           cinNumber: '87654321',
//           status: 'approved',
//           createdAt: '2023-06-18T10:15:00Z',
//           birthDate: '1990-11-22',
//           birthPlace: 'Lyon',
//           address: '5 Avenue des Champs, 69002 Lyon',
//           reason: 'Renouvellement',
//           documents: [
//             { type: 'Photo d\'identité', url: '/documents/photo2.jpg' },
//             { type: 'Ancienne carte d\'identité', url: '/documents/old-id.jpg' }
//           ]
//         },
//         {
//           id: 'CNI-20230618-003',
//           fullName: 'Paul Durand',
//           cinNumber: '11223344',
//           status: 'rejected',
//           createdAt: '2023-06-18T11:45:00Z',
//           birthDate: '1978-03-08',
//           birthPlace: 'Marseille',
//           address: '33 Boulevard de la Mer, 13008 Marseille',
//           reason: 'Perte',
//           documents: [
//             { type: 'Photo d\'identité', url: '/documents/photo3.jpg' },
//             { type: 'Déclaration de perte', url: '/documents/loss.pdf' }
//           ]
//         },
//         {
//           id: 'CNI-20230618-004',
//           fullName: 'Sophie Lambert',
//           cinNumber: '55667788',
//           status: 'processed',
//           createdAt: '2023-06-18T13:20:00Z',
//           birthDate: '1995-07-30',
//           birthPlace: 'Bordeaux',
//           address: '8 Rue Saint-James, 33000 Bordeaux',
//           reason: 'Changement d\'adresse',
//           documents: [
//             { type: 'Photo d\'identité', url: '/documents/photo4.jpg' },
//             { type: 'Justificatif de domicile', url: '/documents/proof2.pdf' }
//           ]
//         }
//       ],
//         // ... autres entrées
//       );
//       setLoading(false);
//     }, 800);

//     return () => {
//       mounted = false;
//     };
//   }, [date]);

//   return { data, loading };
// };


import { useState, useEffect, useCallback } from "react";
import { Request } from "./types";

export const useRequests = (date: Date) => {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const updateRequest = useCallback((id: string, updates: Partial<Request>) => {
    setData(prev => prev.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    setTimeout(() => {
      if (!mounted) return;
      setData([
        {
          id: 'CNI-20230618-001',
          fullName: 'Jean Dupont',
          cinNumber: '12345678',
          status: 'pending',
          createdAt: '2023-06-18T09:30:00Z',
          birthDate: '1985-05-15',
          birthPlace: 'Paris',
          address: '12 Rue de la République, 75001 Paris',
          reason: 'Première demande',
          documents: [
            { type: 'Photo d\'identité', url: '/documents/photo.jpg' },
            { type: 'Justificatif de domicile', url: '/documents/proof.pdf' }
          ]
        },
        // ... autres demandes
      ]);
      setLoading(false);
    }, 800);

    return () => {
      mounted = false;
    };
  }, [date]);

  return { data, loading, updateRequest };
};