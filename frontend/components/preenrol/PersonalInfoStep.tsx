import { useFormContext } from 'react-hook-form'
import CapitalizedInput from '../macro-element/CapitalizedInput'

export default function PersonalInfoStep() {
    const {
        register,
    } = useFormContext()

    return (
        <div className="space-y-4">
            <CapitalizedInput name="lastName" label="Nom" />
            <CapitalizedInput name="firstName" label="Prénom" />
            <div>
                <label className="block">Date de naissance</label>
                <input
                    type="date"
                    {...register('birthDate')}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <CapitalizedInput name='profession' label='Profession' />
            <div>
                <label className="block">Sexe</label>
                <select
                    {...register('gender')}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="" className='text-black' disabled>Sélectionnez</option>
                    <option value="M" className='text-black'>Masculin</option>
                    <option value="F" className='text-black'>Féminin</option>
                </select>
            </div>
        </div>
    )
}
