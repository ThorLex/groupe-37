import { useFormContext } from 'react-hook-form'

export default function ParentsStep() {
    const {
        register,
    } = useFormContext()

    return (
        <div className="space-y-4">
            <div>
                <label className="block">Nom du père</label>
                <input
                    {...register('fatherName')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block">Nom de la mère</label>
                <input
                    {...register('motherName')}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
        </div>
    )
}
