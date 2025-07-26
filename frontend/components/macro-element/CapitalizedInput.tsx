import { useFormContext } from 'react-hook-form';

export default function CapitalizedInput({ name, label }: { name: string; label: string }) {
  const { register, setValue } = useFormContext();

  return (
    <div>
      <label className="block">{label}</label>
      <input
        {...register(name)}
        onInput={(e) => {
          const input = e.currentTarget;
          const start = input.selectionStart;
          const end = input.selectionEnd;
          const value = input.value;
          
          const formatted = value
            .split(' ')
            .map(word => 
              word.length > 0 
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
                : ''
            )
            .join(' ');
          
          input.value = formatted;
          input.setSelectionRange(start, end);
          setValue(name, formatted, { shouldValidate: true });
        }}
        className="w-full px-4 py-2 border rounded"
      />
    </div>
  );
}