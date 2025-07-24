import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { PreEnrollSchema } from '@/types/preEnroll'
import { v5 as uuidv5 } from 'uuid'
import formidable from 'formidable'
import { promises as fs } from 'fs'

const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341'
const resend = new Resend(process.env.RESEND_API_KEY)

export const config = {
  api: {
    bodyParser: false,
  },
}

const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

const generateRequestNumber = (email: string): string => {
  return `REQ-${uuidv5(email, NAMESPACE).slice(0, 8)}-${Date.now().toString().slice(-6)}`
}

const uploadFileToStorage = async (file: File, bucket: string, requestNumber: string) => {
  const ext = file.name.split('.').pop()
  const fileName = `${requestNumber}-${bucket}-${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw new Error(`File upload failed: ${error.message}`)
  
  return data.path
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({
      error: 'Method not allowed'
    })
  }

  try {
    const { fields, files } = await parseForm(req)
    
    // Convertir les fichiers en objets compatibles
    const fileFields = {
      birthAct: files.birthAct as formidable.File,
      nationalityCert: files.nationalityCert as formidable.File,
      photo: files.photo as formidable.File,
    }

    // Lire les contenus des fichiers
    const [birthActContent, nationalityCertContent, photoContent] = await Promise.all([
      fs.readFile(fileFields.birthAct.filepath),
      fs.readFile(fileFields.nationalityCert.filepath),
      fs.readFile(fileFields.photo.filepath),
    ])

    // Créer des objets File simulés
    const birthActFile = new File(
      [birthActContent],
      fileFields.birthAct.originalFilename || 'birthAct.pdf',
      { type: 'application/pdf' }
    )

    const nationalityCertFile = new File(
      [nationalityCertContent],
      fileFields.nationalityCert.originalFilename || 'nationalityCert.pdf',
      { type: 'application/pdf' }
    )

    const photoFile = new File(
      [photoContent],
      fileFields.photo.originalFilename || 'photo.jpg',
      { type: fileFields.photo.mimetype || 'image/jpeg' }
    )

    // Valider les données
    const parsed = PreEnrollSchema.safeParse({
      ...fields,
      birthAct: birthActFile,
      nationalityCert: nationalityCertFile,
      photo: photoFile,
    })

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      })
    }

    const data = parsed.data
    const requestNumber = generateRequestNumber(data.email)

    // Upload des fichiers en parallèle
    const [birthActPath, nationalityCertPath, photoPath] = await Promise.all([
      uploadFileToStorage(data.birthAct, 'birth-acts', requestNumber),
      uploadFileToStorage(data.nationalityCert, 'nationality-certs', requestNumber),
      uploadFileToStorage(data.photo, 'applicant-photos', requestNumber)
    ])

    // Insertion dans la base de données
    const { data: dbData, error: dbError } = await supabase
      .from('pre_enrollments')
      .insert([{
        request_number: requestNumber,
        email: data.email,
        data: {
          ...data,
          birthAct: birthActPath,
          nationalityCert: nationalityCertPath,
          photo: photoPath
        },
        status: 'pending'
      }])
      .select()

    if (dbError) throw dbError

    // Envoi de l'email
    await resend.emails.send({
      from: 'noreply@cni.gov',
      to: data.email,
      subject: 'Confirmation de pré-enrôlement CNI',
      html: `
        <h1>Votre demande #${requestNumber}</h1>
        <p>Nous avons bien reçu votre pré-enrôlement.</p>
        <p>Vous recevrez une notification à chaque étape de traitement.</p>
      `
    })

    return res.status(200).json({
      success: true,
      requestNumber,
      enrollmentId: dbData[0].id
    })

  } catch (error) {
    console.error('Submission error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}