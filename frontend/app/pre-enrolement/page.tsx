'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PersonalInfoStep from '@/components/preenrol/PersonalInfoStep'
import ParentsStep from '@/components/preenrol/ParentsStep'
import AddressStep from '@/components/preenrol/AddressStep'
import AttachmentsStep from '@/components/preenrol/AttachmentsStep'
import ConfirmationStep from '@/components/preenrol/ConfirmationStep'
import NavButton from '@/components/macro-element/NavButton'
import toast from 'react-hot-toast'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function showErrorsWithDelay(errors: { [key: string]: any }, fields: (keyof PreEnrollData)[]) {
  const delayBetween = 110
  fields.forEach((field, index) => {
    const error = errors[field]
    if (error?.message) {
      setTimeout(() => {
        toast.error(`${field}: ${error.message}`, {
          duration: 1500,
          id: `error-${field}-${index}`,
        })
      }, index * delayBetween)
    }
  })
}

const PreEnrollSchema = z.object({
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

type PreEnrollData = z.infer<typeof PreEnrollSchema>

const steps = [
  { label: 'Informations personnelles', component: PersonalInfoStep },
  { label: 'Parents', component: ParentsStep },
  { label: 'Adresse', component: AddressStep },
  { label: 'Pièces jointes', component: AttachmentsStep },
  { label: 'Confirmation', component: ConfirmationStep },
]

const stepFields: Array<Array<keyof PreEnrollData>> = [
  ['firstName', 'lastName', 'birthDate', 'profession', 'gender'],
  ['fatherName', 'motherName'],
  ['city', 'neighborhood', 'email', 'contact1', 'contact2'],
  ['birthAct', 'nationalityCert', 'photo'],
  [],
]

export default function PreEnrollmentPage() {
  const [stepIndex, setStepIndex] = useState(0)

  const form = useForm<PreEnrollData>({
    resolver: zodResolver(PreEnrollSchema),
    mode: 'onBlur',
  })

  const CurrentStep = steps[stepIndex].component
  const progress = ((stepIndex + 1) / steps.length) * 100

  const next = async () => {
    const valid = await form.trigger(stepFields[stepIndex])
    if (valid) {
      if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1)
    } else {
      showErrorsWithDelay(form.formState.errors, stepFields[stepIndex])
    }
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  const onSubmit = (data: PreEnrollData) => {
    const output = {
      ...data,
      birthAct: data.birthAct
        ? { name: data.birthAct.name, size: data.birthAct.size, type: data.birthAct.type }
        : null,
      nationalityCert: data.nationalityCert
        ? { name: data.nationalityCert.name, size: data.nationalityCert.size, type: data.nationalityCert.type }
        : null,
      photo: data.photo
        ? { name: data.photo.name, size: data.photo.size, type: data.photo.type }
        : null,
    }
    console.log('✅ Données Pré-enrôlement :', JSON.stringify(output, null, 2))
    setStepIndex(stepIndex + 1)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Pré-enrôlement</h1>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-lg font-medium">{steps[stepIndex].label}</p>

      <FormProvider {...form}>
        {stepIndex < steps.length - 1 ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CurrentStep />
            <div className="flex justify-between pt-4">
              {stepIndex > 0 ? (
                <NavButton variant="primary" onClick={back} type="button">
                  Retour
                </NavButton>
              ) : (
                <div />
              )}
              {stepIndex < steps.length - 2 ? (
                <NavButton onClick={next} type="button">
                  Suivant
                </NavButton>
              ) : (
                <NavButton type="submit">Valider</NavButton>
              )}
            </div>
          </form>
        ) : (
          <CurrentStep />
        )}
      </FormProvider>
    </div>
  )
}