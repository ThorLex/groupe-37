import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/supabase' // Assurez-vous que c'est le bon chemin
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import Busboy from 'busboy'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await parseFormData(req)
    const files = formData.files
    const fields = formData.fields

    // Validation des champs obligatoires
    const requiredFields = [
      'firstname', 'lastname', 'birthdate', 'profession', 'genre',
      'fatherName', 'motherName', 'father_profession', 'mother_profession',
      'city', 'neighborhood', 'email', 'contact1'
    ]
    
    for (const field of requiredFields) {
      if (!fields[field]) {
        return NextResponse.json({ error: `Champ manquant: ${field}` }, { status: 400 })
      }
    }

    // Validation des fichiers
    const requiredFiles = ['birthAct', 'nationalityCert', 'photo']
    for (const fileType of requiredFiles) {
      if (!files[fileType]) {
        return NextResponse.json({ error: `Fichier manquant: ${fileType}` }, { status: 400 })
      }
      if (files[fileType].size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: `Fichier trop volumineux (>3Mo): ${fileType}` }, { status: 400 })
      }
    }

    const lowerCaseFields: Record<string, string> = {}
    for (const [key, value] of Object.entries(fields)) {
      lowerCaseFields[key.toLowerCase()] = value;
    }

    // Upload des fichiers
    const filePaths: Record<string, string> = {};
    for (const [fileType, file] of Object.entries(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `pre-enrollment/${fileName}`;
        
        // Convertir le nom du fichier en minuscules pour la colonne
        const dbColumn = `${fileType.toLowerCase()}_path`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file.data, {
            contentType: file.mimetype,
            });

        if (uploadError) throw uploadError;
        
        filePaths[dbColumn] = filePath;
    }

    // Génération ID de demande
    const today = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const randomId = Math.floor(100000 + Math.random() * 900000)
    const idDemande = `REQ-${today}-${randomId}`

    // Insertion en base de données
    const { error: dbError } = await supabase
      .from('pre_enrollment')
      .insert([
        {
          ...lowerCaseFields,
          ...filePaths,
          iddemande: idDemande,
          contact2: lowerCaseFields.contact2 || null,
        }
      ])

    if (dbError) throw dbError

    // Envoi de la notification
    await sendConfirmationEmail(lowerCaseFields.email, lowerCaseFields.firstname, idDemande)

    return NextResponse.json({ 
      success: true, 
      idDemande,
      message: "Pré-enrôlement réussi"
    }, { status: 200 })

  } catch (error) {
    console.error('Erreur pré-enrôlement:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Fonction parseFormData mise à jour
async function parseFormData(req: NextRequest): Promise<{
  fields: Record<string, string>;
  files: Record<string, { name: string; mimetype: string; data: Buffer; size: number }>;
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {}
    const files: Record<string, { name: string; mimetype: string; data: Buffer; size: number }> = {}
    const contentType = req.headers.get('content-type') || ''

    const bb = Busboy({ headers: { 'content-type': contentType } })

    bb.on('field', (name, val) => {
      fields[name] = val
    })

    bb.on('file', (name, file, info) => {
      const { filename, mimeType } = info
      const chunks: Buffer[] = []
      
      file.on('data', (chunk) => chunks.push(chunk))
      file.on('end', () => {
        const buffer = Buffer.concat(chunks)
        files[name] = {
          name: filename || 'unnamed',
          mimetype: mimeType,
          data: buffer,
          size: buffer.length
        }
      })
    })

    bb.on('close', () => resolve({ fields, files }))
    bb.on('error', (err) => reject(err))

    // Pipe le corps de la requête
    const reader = req.body?.getReader()
    const pump = async () => {
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            bb.end()
            break
          }
          bb.write(value)
        }
      }
    }
    pump().catch(reject)
  })
}

async function sendConfirmationEmail(
    to: string,
    name: string,
    idDemande: string
): Promise<{ success: boolean; error?: string }> {
    try {
        console.log(`Tentative d'envoi d'email à: ${to} pour la demande ${idDemande}`);
        
        // Vérifier si l'adresse email est valide
        if (!to || !to.includes('@')) {
            const errorMsg = `Adresse email invalide: ${to}`;
            console.error(errorMsg);
            return { success: false, error: errorMsg };
        }

        // Vérifier la présence de la clé API Resend
        if (!process.env.RESEND_API_KEY) {
            const errorMsg = "Clé API Resend manquante dans l'environnement";
            console.error(errorMsg);
            return { success: false, error: errorMsg };
        }

        // Utiliser un domaine vérifié
        const verifiedDomain = "ivan-dev.me"; // Remplacez par votre domaine vérifié
        const from = `noreply@${verifiedDomain}`;

        const response = await resend.emails.send({
            from,
            to,
            subject: 'Confirmation de votre demande CNI',
            html: `<p>Bonjour ${name},</p>
                   <p>Votre demande de CNI (#${idDemande}) a été enregistrée avec succès.</p>
                   <p>Vous pouvez suivre l'état de votre demande avec ce numéro.</p>`
        });

        if (response.error) {
            console.error("Erreur d'envoi d'email (Resend API):", {
                code: (response.error as { code?: string })?.code ?? 'N/A',
                message: response.error.message,
                statusCode: (response.error as { statusCode?: number })?.statusCode ?? 'N/A',
                to,
                idDemande
            });
            return { 
                success: false, 
                error: `Erreur Resend: ${response.error.message} (code: ${(response.error as { code?: string })?.code ?? 'N/A'})` 
            };
        }

        console.log(`Email envoyé avec succès à: ${to} (ID: ${response.data?.id})`);
        return { success: true };
        
    } catch (emailError: unknown) {
        // Journalisation détaillée de l'erreur
        const errorDetails = {
            message: emailError instanceof Error ? emailError.message : String(emailError),
            stack: emailError instanceof Error ? emailError.stack : undefined,
            name: emailError instanceof Error ? emailError.name : undefined,
            to,
            idDemande,
            timestamp: new Date().toISOString()
        };
        
        console.error("Erreur d'envoi d'email (Exception):", errorDetails);
        
        return { 
            success: false, 
            error: `Échec de l'envoi de l'email: ${emailError instanceof Error ? emailError.message : String(emailError)}` 
        };
    }
}