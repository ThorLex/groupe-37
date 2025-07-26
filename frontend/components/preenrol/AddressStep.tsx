import { useFormContext } from 'react-hook-form'
import CapitalizedInput from '../macro-element/CapitalizedInput'

export default function AddressStep() {
    const {
        register,
    } = useFormContext()

    return (
        <div className="space-y-4">
            <CapitalizedInput name='city' label='Ville de résidence' />
            <CapitalizedInput name='neighborhood' label='Quartier' />
            <div>
                <label className="block">Email</label>
                <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block">Contact 1</label>
                <input
                    type="tel"
                    maxLength={9}
                    {...register('contact1')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block">Contact 2 (optionnel)</label>
                <input
                    type="tel"
                    maxLength={9}
                    {...register('contact2')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
        </div>
    )
}
