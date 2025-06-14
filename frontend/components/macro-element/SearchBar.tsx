import { Search } from "lucide-react"
import NavButton from "./NavButton"
import { FormEvent, useState } from "react"
import { z } from 'zod'

const SearchSchema = z
  .string()
  .nonempty({ message: "Le champ ne peut pas être vide" })
  .regex(/^LT\/[A-Z]\/\d{2}\/\d{2}\/\d{2}\/\d{5}$/, {
    message: "Le format du numéro de demande est invalide (ex: XX/X/XX/XX/XX/XXXXX)"
  })

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = SearchSchema.safeParse(query)

    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    setError(null)
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center my-8">
      <input 
        type="text" 
        name="code" 
        id="code"
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Entrer le code de la demande pour rechercher" 
        className="bg-white md:min-w-1/3 px-3 py-1 rounded-lg text-black focus:outline-none placeholder:text-gray-400 shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]"
      />
      <NavButton type="submit" variant={"search"}>
        <Search size={32} />
      </NavButton>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </form>
  )
}

export default SearchBar