import { z } from 'zod'

const isAtLeast18 = (dateString: string) => {
  const birthDate = new Date(dateString)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birthDate.getDate())
}

const isNotInFuture = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  return date <= today
}

const phonePattern = /^[6]\d{8}$/

export const PreEnrollSchema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  birthDate: z.string()
    .refine(isNotInFuture, { message: 'Date invalide' })
    .refine(val => isAtLeast18(val), {
      message: "Vous devez avoir au moins 18 ans",
    }),
  profession: z.string().min(1, 'Requis'),
  gender: z.enum(['M', 'F'], {
    required_error: 'Requis',
  }),
  fatherName: z.string().min(1, 'Requis'),
  fatherprofession: z.string().min(1, 'Requis'),
  motherName: z.string().min(1, 'Requis'),
  motherprofession: z.string().min(1, 'Requis'),
  city: z.string().min(1, 'Requis'),
  neighborhood: z.string().min(1, 'Requis'),
  email: z.string().email('Email invalide'),
  contact1: z
    .string()
    .regex(phonePattern, 'Doit commencer par 6 et contenir 9 chiffres (6XXXXXXXXX)'),
  contact2: z
    .string()
    .optional()
    .refine(val => !val || phonePattern.test(val), {
      message: 'Doit commencer par 6 et contenir 9 chiffres (6XXXXXXXXX)',
    }),
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