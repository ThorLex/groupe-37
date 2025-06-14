import { useFormContext } from 'react-hook-form'

export default function AddressStep() {
    const {
        register,
    } = useFormContext()

    return (
        <div className="space-y-4">
            <div>
                <label className="block">Ville de résidence</label>
                <input
                    {...register('city')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block">Quartier</label>
                <input
                    {...register('neighborhood')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
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
                    {...register('contact1')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block">Contact 2 (optionnel)</label>
                <input
                    type="tel"
                    {...register('contact2')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
        </div>
    )
}
