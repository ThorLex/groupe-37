import CapitalizedInput from '../macro-element/CapitalizedInput'

export default function ParentsStep() {
    return (
        <div className="space-y-4">
            <CapitalizedInput name='fatherName' label='Nom du père' />
            <CapitalizedInput name='fatherprofession' label='Profession du père' />
            <CapitalizedInput name='motherName' label='Nom de la mère' />
            <CapitalizedInput name='motherprofession' label='Profession de la mère' />
        </div>
    )
}