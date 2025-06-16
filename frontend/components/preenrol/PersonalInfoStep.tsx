import { useFormContext } from 'react-hook-form'

export default function PersonalInfoStep() {
    const {
        register,
    } = useFormContext()

    return (
        <div className="space-y-4">
            <div>
                <label className="block">Nom</label>
                <input
                    {...register('lastName')}
                    className="w-full px-4 py-2 border rounded"
                />
                {/* {typeof errors.lastName?.message == 'string' && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )} */}
            </div>
            <div>
                <label className="block">Prénom</label>
                <input
                    {...register('firstName')}
                    className="w-full px-4 py-2 border rounded"
                />
                {/* {typeof errors.firstName?.message == 'string' && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )} */}
            </div>
            <div>
                <label className="block">Date de naissance</label>
                <input
                    type="date"
                    {...register('birthDate')}
                    className="w-full px-4 py-2 border rounded"
                />
                {/* {typeof errors.birthDate?.message == 'string' && (
                    <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
                )} */}
            </div>
            <div>
                <label className="block">Profession</label>
                <input
                    {...register('profession')}
                    className="w-full px-4 py-2 border rounded"
                />
                {/* {typeof errors.profession?.message == 'string' && (
                    <p className="text-red-500 text-sm">{errors.profession.message}</p>
                )} */}
            </div>
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
                {/* {typeof errors.gender?.message == 'string' && (
                    <p className="text-red-500 text-sm">{errors.gender.message}</p>
                )} */}
            </div>
        </div>
    )
}
