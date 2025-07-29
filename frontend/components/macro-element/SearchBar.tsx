// import { Search } from "lucide-react"
// import NavButton from "./NavButton"
// import { FormEvent, useState } from "react"
// import { z } from 'zod'

// const SearchSchema = z
//   .string()
//   .nonempty({ message: "Le champ ne peut pas être vide" })
//   .regex(/^LT\/[A-Z]\/\d{2}\/\d{2}\/\d{2}\/\d{5}$/, {
//     message: "Le format du numéro de demande est invalide (ex: XX/X/XX/XX/XX/XXXXX)"
//   })

// interface SearchBarProps {
//   onSearch: (query: string) => void
// }

// const SearchBar = ({ onSearch }: SearchBarProps) => {
//   const [query, setQuery] = useState('')
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const result = SearchSchema.safeParse(query)

//     if (!result.success) {
//       setError(result.error.errors[0].message)
//       return
//     }

//     setError(null)
//     onSearch(query)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex justify-center items-center my-8">
//       <input 
//         type="text" 
//         name="code" 
//         id="code"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)} 
//         placeholder="Entrer le code de la demande pour rechercher" 
//         className="bg-white md:min-w-1/3 px-3 py-1 rounded-lg text-black focus:outline-none placeholder:text-gray-400 shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]"
//       />
//       <NavButton type="submit" variant={"search"}>
//         <Search size={32} />
//       </NavButton>
//       {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
//     </form>
//   )
// }

// export default SearchBar


// import { Search } from "lucide-react"
// import NavButton from "./NavButton"
// import { FormEvent, useState } from "react"
// import { z } from 'zod'

// const SearchSchema = z
//   .string()
//   .nonempty({ message: "Le champ ne peut pas être vide" })
//   .regex(/^REQ-\d{6}-\d{6}$/, {
//     message: "Format invalide (ex: REQ-250726-123456)"
//   })

// interface SearchBarProps {
//   onSearch: (query: string) => void
//   loading?: boolean
// }

// const SearchBar = ({ onSearch, loading = false }: SearchBarProps) => {
//   const [query, setQuery] = useState('')
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const result = SearchSchema.safeParse(query)

//     if (!result.success) {
//       setError(result.error.errors[0].message)
//       return
//     }

//     setError(null)
//     onSearch(query)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex justify-center items-center my-8">
//       <input 
//         type="text" 
//         name="code" 
//         id="code"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)} 
//         placeholder="Entrez votre numéro de demande (ex: REQ-250726-123456)" 
//         className="bg-white w-full md:max-w-lg px-4 py-2 rounded-lg text-black focus:outline-none placeholder:text-gray-400 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]"
//         disabled={loading}
//       />
//       <NavButton 
//         type="submit" 
//         variant={"search"}
//         className="ml-2"
//         disabled={loading}
//       >
//         {loading ? (
//           <div className="flex items-center">
//             <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Recherche...
//           </div>
//         ) : (
//           <div className="flex items-center">
//             <Search size={20} className="mr-1" />
//             Rechercher
//           </div>
//         )}
//       </NavButton>
      
//       {error && (
//         <div className="absolute mt-16 bg-red-50 text-red-700 px-4 py-2 rounded-md">
//           {error}
//         </div>
//       )}
//     </form>
//   )
// }

// export default SearchBar

import { Search } from "lucide-react"
import NavButton from "./NavButton"
import { FormEvent, useState } from "react"
import { z } from 'zod'

const SearchSchema = z
  .string()
  .nonempty({ message: "Le champ ne peut pas être vide" })
  .regex(/^REQ-\d{6}-\d{6}$/, {
    message: "Format invalide (ex: REQ-XXXXXX-XXXXXX)"
  })

interface SearchBarProps {
  onSearch: (query: string) => void
  loading?: boolean
}

const SearchBar = ({ onSearch, loading = false }: SearchBarProps) => {
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
    <div className="flex flex-col items-center my-8">
      <form onSubmit={handleSubmit} className="flex justify-center items-center w-full">
        <input 
          type="text" 
          name="code" 
          id="code"
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Entrez votre numéro de demande (ex: REQ-XXXXXX-XXXXXX)" 
          className="bg-white w-full md:max-w-lg px-4 py-2 rounded-lg text-black focus:outline-none placeholder:text-gray-400 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]"
          disabled={loading}
        />
        <NavButton 
          type="submit" 
          variant={"search"}
          className="ml-2"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recherche...
            </div>
          ) : (
            <div className="flex items-center">
              <Search size={20} className="mr-1" />
              Rechercher
            </div>
          )}
        </NavButton>
      </form>
      
      {error && (
        <div className="mt-2 bg-red-50 text-red-700 px-4 py-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}

export default SearchBar