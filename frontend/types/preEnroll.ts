import { z } from 'zod'

// export const PreEnrollSchema = z.object({
//   firstName: z.string().min(1, 'Requis'),
//   lastName: z.string().min(1, 'Requis'),
//   birthDate: z.string().refine(val => Boolean(Date.parse(val)), 'Date invalide'),
//   profession: z.string().min(1, 'Requis'),
//   gender: z.enum(['M', 'F'], { required_error: 'Requis' }),
//   fatherName: z.string().min(1, 'Requis'),
//   motherName: z.string().min(1, 'Requis'),
//   city: z.string().min(1, 'Requis'),
//   neighborhood: z.string().min(1, 'Requis'),
//   email: z.string().email('Email invalide'),
//   contact1: z.string().min(8, 'Numéro invalide'),
//   contact2: z.string().optional(),
//   birthAct: z.any().refine(val => val instanceof File, { message: 'Fichier requis' }),
//   nationalityCert: z.any().refine(val => val instanceof File, { message: 'Fichier requis' }),
//   photo: z.any().refine(val => val instanceof File, { message: 'Fichier requis' })
// })
export const PreEnrollSchema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  birthDate: z.string().refine(val => Boolean(Date.parse(val)), 'Date invalide'),
  profession: z.string().min(1, 'Requis'),
  gender: z.enum(['M', 'F'], {
    required_error: 'Requis',
  }),
  fatherName: z.string().min(1, 'Requis'),
  motherName: z.string().min(1, 'Requis'),
  city: z.string().min(1, 'Requis'),
  neighborhood: z.string().min(1, 'Requis'),
  email: z.string().email('Email invalide'),
  contact1: z.string().min(8, 'Numéro invalide'),
  contact2: z.string().optional(),
  birthAct: z
    .instanceof(File)
    .refine(file => file?.type === 'application/pdf', { message: 'PDF requis' }),

  nationalityCert: z
    .instanceof(File)
    .refine(file => file?.type === 'application/pdf', { message: 'PDF requis' }),

  photo: z
    .instanceof(File)
    .refine(file => ['image/png', 'image/jpeg'].includes(file?.type), { message: 'Image requise (PNG/JPG)' }),
})

export type PreEnrollData = z.infer<typeof PreEnrollSchema>