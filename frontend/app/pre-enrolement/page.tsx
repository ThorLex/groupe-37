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
import { PreEnrollSchema } from '@/types/preEnroll'
import { Loader2 } from 'lucide-react'
// import { Key } from 'lucide-react'

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
  ['fatherName', 'fatherprofession', 'motherName', 'motherprofession'],
  ['city', 'neighborhood', 'email', 'contact1', 'contact2'],
  ['birthAct', 'nationalityCert', 'photo'],
  [],
]

export default function PreEnrollmentPage() {
  const [stepIndex, setStepIndex] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [idDemande, setIdDemande] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const onSubmit = async (data: PreEnrollData) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Object.entries(data).forEach(([key, value]) => {
      //   if (key === 'birthAct' || key === 'nationalityCert' || key === 'photo') {
      //     formData.append(key, value)
      //   }
      // });

      // if (data.birthAct) {
      //   formData.append('birthAct', data.birthAct)
      // }
      // if (data.nationalityCert) {
      //   formData.append('nationalityCert', data.nationalityCert)
      // }
      // if (data.photo) {
      //   formData.append('photo', data.photo)
      // }

      const fieldMappings: Record<string, string> = {
        firstName: 'firstname',
        lastName: 'lastname',
        birthDate: 'birthdate',
        gender: 'genre',
        fatherprofession: 'father_profession',
        motherprofession: 'mother_profession'
      };

      Object.entries(data).forEach(([key, value]) => {
        const backendKey = fieldMappings[key] || key;
        
        if (value instanceof File) {
          formData.append(backendKey, value);
        } else if (value !== null && value !== undefined) {
          formData.append(backendKey, String(value));
        }
      });

      const response = await fetch('/api/preenroll', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setIdDemande(result.idDemande);
        setStepIndex(stepIndex + 1);
      } else {
        throw new Error(result.error || 'Erreur lors de la soumission');
      }
    } catch (error) {
      toast.error(`Erreur : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
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
                <NavButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Valider"
                  )}
                </NavButton>
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