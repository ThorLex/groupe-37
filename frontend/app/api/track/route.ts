import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idDemande = searchParams.get('id')

    if (!idDemande) {
      return NextResponse.json({ error: "Le paramètre 'id' est requis" }, { status: 400 })
    }

    const idRegex = /^REQ-\d{6}-\d{6}$/;
    if (!idRegex.test(idDemande)) {
      return NextResponse.json({ error: "Format du numéro de demande invalide" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pre_enrollment')
      .select(`
        iddemande,
        firstname,
        lastname,
        initiationdate,
        biometricdate,
        biometric_pass,
        locationcni,
        rejection_reason,
        status,
        photo_path
      `)
      .eq('iddemande', idDemande)
      .single()

    if (error) {
      console.error('Erreur recherche demande:', error)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Aucune demande correspondante' }, { status: 404 })
    }

    const formatDate = (dateString: string | null) => {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    }

    let photoUrl = null
    if (data.photo_path) {
      try {
        const { data: signedUrlData, error: storageError } = await supabase
          .storage
          .from('documents')
          .createSignedUrl(data.photo_path, 3600)

        if (storageError) throw storageError
        photoUrl = signedUrlData?.signedUrl
      } catch (err) {
        console.error('Erreur génération URL image:', err)
      }
    }

    const responseData = {
      idDemande: data.iddemande,
      firstName: data.firstname,
      lastName: data.lastname,
      initiationDate: formatDate(data.initiationdate),
      biometricDate: formatDate(data.biometricdate),
      biometricPass: data.biometric_pass?.toString() || null,
      locationCNI: data.locationcni,
      rejectionReason: data.rejection_reason,
      status: data.status,
      photoUrl: photoUrl
    }

    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    console.error('Erreur suivi demande:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}