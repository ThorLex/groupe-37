import { useFormContext, Controller } from 'react-hook-form'

export default function AttachmentsStep() {
    const {
        control,
    } = useFormContext();

    return (
        <div className="space-y-4">
            <Controller
                name="birthAct"
                control={control}
                defaultValue={null}
                rules={{ required: 'Acte de naissance requis (PDF)' }}
                render={({ field }) => (
                    <div>
                        <label htmlFor='birthAct' className="block">Acte de naissance (PDF)</label>
                        <input
                            id="birthAct"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                            className="mt-1 cursor-pointer"
                        />
                    </div>
                )}
            />

            <Controller
                name="nationalityCert"
                control={control}
                defaultValue={null}
                rules={{ required: 'Certificat de nationalité requis (PDF)' }}
                render={({ field }) => (
                    <div>
                        <label htmlFor='cert' className="block">Certificat de nationalité (PDF)</label>
                        <input
                            id='cert'
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                            className="mt-1 cursor-pointer"
                        />
                    </div>
                )}
            />

            <Controller
                name="photo"
                control={control}
                defaultValue={null}
                rules={{ required: 'Photo 4x4 requise (PNG/JPG)' }}
                render={({ field }) => (
                    <div>
                        <label htmlFor='photo' className="block">Photo 4x4 (PNG/JPG)</label>
                        <input
                            id='photo'
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                            className="mt-1 cursor-pointer"
                        />
                    </div>
                )}
            />
        </div>
    )
}