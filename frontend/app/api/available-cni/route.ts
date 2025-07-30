import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/supabase' 

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Récupérer les demandes ayant passé la biométrie et non retirées
    const { data, error } = await supabase
      .from('pre_enrollment')
      .select(`
        iddemande,
        firstname,
        lastname,
        biometricdate,
        birthdate,
        city,
        neighborhood,
        contact1,
        email,
        locationcni,
        cni_picked
      `)
      .eq('biometric_pass', true) // Biométrie validée
      .eq('cni_picked', false)    // CNI non encore retirée
      .order('biometricdate', { ascending: false })

    if (error) {
      console.error('Erreur recherche CNI disponibles:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    // Formater les données
    const formattedData = data.map(item => ({
      id: item.iddemande,
      fullName: `${item.firstname} ${item.lastname}`,
      birthdate: item.birthdate,
      city: item.city,
      neighborhood: item.neighborhood,
      contact: item.contact1,
      email: item.email,
      biometricDate: item.biometricdate,
      locationcni: item.locationcni,
      cniPicked: item.cni_picked || false,
    }))

    return NextResponse.json(formattedData, { status: 200 })

  } catch (error) {
    console.error('Erreur GET /api/available-cni:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, locationcni, markAsPicked } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la demande est requis" },
        { status: 400 }
      )
    }

    let updateData = {};
    let shouldSendEmail = false;

    if (locationcni) {
      updateData = { locationcni: locationcni };
      shouldSendEmail = true;
    } else if (markAsPicked) {
      updateData = { cni_picked: true };
    }

    // Mettre à jour la demande
    const { error: updateError, data: updatedRequest } = await supabase
      .from('pre_enrollment')
      .update(updateData)
      .eq('iddemande', id)
      .select('firstname, lastname, email, locationcni')
      .single()

    if (updateError) {
      console.error('Erreur mise à jour demande:', updateError)
      return NextResponse.json(
        { error: 'Erreur de base de données' },
        { status: 500 }
      )
    }

    // Envoyer un email si un lieu de retrait a été spécifié
    if (shouldSendEmail && updatedRequest?.email) {
      await sendPickupNotification(
        updatedRequest.email,
        `${updatedRequest.firstname} ${updatedRequest.lastname}`,
        id,
        locationcni
      );
    }

    return NextResponse.json(
      { success: true, message: 'Demande mise à jour' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur PATCH /api/available-cni:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Fonction pour envoyer la notification de retrait
async function sendPickupNotification(
  to: string,
  name: string,
  idDemande: string,
  pickupLocation: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verifiedDomain = "ivan-dev.me";
    const from = `noreply@${verifiedDomain}`;

    const response = await resend.emails.send({
      from,
      to,
      subject: 'Votre CNI est prête à être retirée',
      html: `<p>Bonjour ${name},</p>
             <p>Votre carte nationale d'identité (demande #${idDemande}) est prête à être retirée.</p>
             <p><strong>Lieu de retrait :</strong> ${pickupLocation}</p>
             <p>Vous pouvez vous présenter à ce lieu avec une pièce d'identité pour récupérer votre CNI.</p>
             <p>Heures d'ouverture : du lundi au vendredi, 8h-16h</p>`
    });

    if (response.error) {
      console.error("Erreur d'envoi d'email:", response.error);
      return { success: false };
    }

    console.log(`Email de retrait envoyé à: ${to}`);
    return { success: true };
    
  } catch (error) {
    console.error("Erreur d'envoi de notification:", error);
    return { success: false };
  }
}