import { resend } from "./supabase";

export async function sendStatusUpdateEmail(
  to: string,
  name: string,
  idDemande: string,
  status: string,
  rejectionReason?: string,
  biometryDate?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let subject = '';
    let html = '';

    if (status === 'approved') {
      subject = 'Demande CNI Approuvée';
      html = `<p>Bonjour ${name},</p>
              <p>Votre demande de CNI (#${idDemande}) a été approuvée.</p>
              <p><strong>Date de biométrie:</strong> ${new Date(biometryDate!).toLocaleDateString('fr-FR')}</p>
              <p>Présentez-vous au centre avec vos documents originaux.</p>`;
    } else if (status === 'rejected') {
      subject = 'Demande CNI Rejetée';
      html = `<p>Bonjour ${name},</p>
              <p>Votre demande de CNI (#${idDemande}) a été rejetée.</p>
              <p><strong>Motif:</strong> ${rejectionReason}</p>
              <p>Vous pouvez soumettre une nouvelle demande après correction.</p>`;
    } else {
      // Ne pas envoyer pour les autres statuts
      return { success: true };
    }

    const verifiedDomain = "idExpress.com";
    const from = `noreply@${verifiedDomain}`;

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html
    });

    if (response.error) {
      console.error("Erreur d'envoi de notification:", response.error);
      return { success: false };
    }

    console.log(`Notification envoyée à: ${to} (Statut: ${status})`);
    return { success: true };
    
  } catch (error) {
    console.error("Erreur d'envoi de notification:", error);
    return { success: false };
  }
}
