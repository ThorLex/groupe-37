import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Récupérer les demandes approuvées pour la date de biométrie
    const { data, error } = await supabase
      .from('pre_enrollment')
      .select(`
        iddemande,
        firstname,
        lastname,
        biometricdate,
        biometric_pass,
        birthdate,
        city,
        neighborhood,
        fathername,
        father_profession,
        mothername,
        mother_profession,
        contact1,
        profession,
        genre
      `)
      .eq('status', 'approved')
      .gte('biometricdate', startDate.toISOString())
      .lte('biometricdate', endDate.toISOString())
      .order('biometricdate', { ascending: true })

    if (error) {
      console.error('Erreur recherche demandes biométrie:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    // Formater les données
    const formattedData = data.map(item => ({
      id: item.iddemande,
      fullName: `${item.firstname} ${item.lastname}`,
      status: 'approved',
      biometricdate: item.biometricdate,
      biometric_pass: item.biometric_pass || false, // NULL devient false
      birthdate: item.birthdate,
      city: item.city,
      neighborhood: item.neighborhood,
      fathername: item.fathername,
      father_profession: item.father_profession,
      mothername: item.mothername,
      mother_profession: item.mother_profession,
      contact1: item.contact1,
      profession: item.profession,
      genre: item.genre,
      documents: [],
    }))

    return NextResponse.json(formattedData, { status: 200 })

  } catch (error) {
    console.error('Erreur GET /api/biometry:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la demande est requis" },
        { status: 400 }
      )
    }

    // Mettre à jour le statut biométrique
    const { error } = await supabase
      .from('pre_enrollment')
      .update({ 
        biometric_pass: true, // Nouveau nom de colonne
        status: 'completed' // Optionnel: changer le statut global
      })
      .eq('iddemande', id)

    if (error) {
      console.error('Erreur mise à jour biométrie:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Biométrie validée' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur PATCH /api/biometry:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}