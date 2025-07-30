import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendStatusUpdateEmail } from '@/lib/notifications'


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { error: "Le paramètre 'date' est requis" },
        { status: 400 }
      )
    }

    // Convertir la date en plage journalière
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    // Récupérer les demandes pour la date spécifiée
    const { data, error } = await supabase
      .from('pre_enrollment')
      .select(`
        iddemande,
        firstname,
        lastname,
        birthdate,
        genre,
        fathername,
        mothername,
        father_profession,
        mother_profession,
        contact1,
        city,
        neighborhood,
        profession,
        status,
        biometricdate,
        rejection_reason,
        birthact_path,
        nationalitycert_path,
        photo_path
      `)
      .gte('initiationdate', startDate.toISOString())
      .lte('initiationdate', endDate.toISOString())
      .order('initiationdate', { ascending: false })

    if (error) {
      console.error('Erreur recherche demandes:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    // Définir le type attendu pour les items retournés par Supabase
    interface SupabaseRequestRow {
      iddemande: string;
      firstname: string;
      lastname: string;
      birthdate: string;
      genre: string;
      fathername: string;
      father_profession: string;
      mothername: string;
      mother_profession: string;
      contact1: string;
      profession: string;
      city: string;
      neighborhood: string;
      status: string;
      rejection_reason?: string;
      biometricdate?: string;
      birthact_path?: string;
      nationalitycert_path?: string;
      photo_path?: string;
    }

    // Formater les données et générer les URLs signés
    const formattedData = await Promise.all(
      Array.isArray(data) && data.every(item => typeof item === 'object' && item !== null)
        ? data.map(async (item: SupabaseRequestRow) => {
            const documents = await Promise.all([
              generateDocument('Acte de naissance', item.birthact_path ?? null),
              generateDocument('Certificat nationalité', item.nationalitycert_path ?? null),
              generateDocument('Photo', item.photo_path ?? null),
            ])

            return {
              id: item.iddemande,
              fullName: `${item.firstname} ${item.lastname}`,
              birthdate: item.birthdate,
              fathername: item.fathername,
              father_profession: item.father_profession,
              mothername: item.mothername,
              mother_profession: item.mother_profession,
              profession: item.profession,
              contact1: item.contact1,
              genre: item.genre,
              city: item.city,
              neighborhood: item.neighborhood,
              status: item.status,
              rejection_reason: item.rejection_reason,
              biometricdate: item.biometricdate,
              documents: documents.filter(doc => doc !== null) as { type: string; url: string }[],
            }
          })
        : []
    )

    return NextResponse.json(formattedData, { status: 200 })

  } catch (error) {
    console.error('Erreur GET /api/requests:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour générer les URLs signés
async function generateDocument(
  type: string,
  path: string | null
): Promise<{ type: string; url: string } | null> {
  if (!path) return null

  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 3600) // 1 heure de validité

    if (error || !data) {
      console.error(`Erreur génération URL pour ${type}:`, error)
      return null
    }

    return { type, url: data.signedUrl }
  } catch (err) {
    console.error(`Exception génération URL pour ${type}:`, err)
    return null
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // eslint-disable-next-line prefer-const
    let { id, status, biometricdate, rejection_reason } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la demande est requis" },
        { status: 400 }
      )
    }

    console.log('Mise à jour demande:', { id, status, biometricdate, rejection_reason })

    const { data: existingRequest, error: fetchError } = await supabase
      .from('pre_enrollment')
      .select('email, firstname, iddemande')
      .eq('iddemande', id)
      .single()

    if (fetchError || !existingRequest) {
      console.error('Demande introuvable:', id)
      return NextResponse.json(
        { error: 'Demande introuvable' },
        { status: 404 }
      )
    }

    // Préparer les données de mise à jour
    const updateData: Record<string, string | undefined> = { status }

    if (status === 'approved' && biometricdate) {
      updateData.biometricdate = new Date(biometricdate).toISOString()
    }

    if (status === 'rejected' && rejection_reason) {
      updateData.rejection_reason = rejection_reason
    }

    // Mettre à jour la demande dans la base
    const { error } = await supabase
      .from('pre_enrollment')
      .update(updateData)
      .eq('iddemande', id)

    if (error) {
      console.error('Erreur mise à jour demande:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    // Dans la fonction PATCH, avant l'envoi de l'email:
    if (status === 'approved' && biometricdate) {
      // Convertir en format ISO
      const isoDate = new Date(biometricdate).toISOString();
      updateData.biometricdate = isoDate;
      
      // Conserver pour l'email (format lisible)
      biometricdate = isoDate;
    }

    // Envoyer la notification
    try {
      await sendStatusUpdateEmail(
        existingRequest.email,
        existingRequest.firstname,
        existingRequest.iddemande,
        status,
        rejection_reason,
        biometricdate
      )
    } catch (emailError) {
      console.error('Erreur envoi email notification:', emailError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de la notification' },
        { status: 500 }
      )   
    }

    return NextResponse.json(
      { success: true, message: 'Demande mise à jour' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur PATCH /api/requests:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}