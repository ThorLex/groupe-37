import { useFormContext } from 'react-hook-form'
import DropzoneInput from '../ui/DropZoneInput'
import { FileWithPath } from 'react-dropzone'
import { useEffect, useState } from 'react'
import { FileText, X } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function AttachmentsStep() {
    const { setValue, getValues, trigger } = useFormContext()
    const [fileError, setFileError] = useState<string | null>(null)
    const [currentFiles, setCurrentFiles] = useState<FileWithPath[]>([])

    // Initialiser les fichiers actuels à partir des valeurs du formulaire
    useEffect(() => {
        const birthAct = getValues('birthAct')
        const nationalityCert = getValues('nationalityCert')
        const photo = getValues('photo')
        
        const files = []
        if (birthAct) files.push(birthAct)
        if (nationalityCert) files.push(nationalityCert)
        if (photo) files.push(photo)
        
        setCurrentFiles(files)
    }, [getValues])

    const handleDrop = (files: FileWithPath[]) => {
        setFileError(null)
        
        // Vérifier le nombre total de fichiers
        const totalFiles = [...currentFiles, ...files]
        if (totalFiles.length > 3) {
            setFileError('Vous ne pouvez pas ajouter plus de 3 fichiers')
            return
        }
        
        // Compter les PDF et images
        let pdfCount = 0
        let imageCount = 0
        
        totalFiles.forEach(file => {
            const ext = file.name.split('.').pop()?.toLowerCase()
            if (ext === 'pdf') pdfCount++
            if (['png', 'jpg', 'jpeg'].includes(ext || '')) imageCount++
        })
        
        // Vérifier les limites
        if (pdfCount > 2) {
            setFileError('Vous ne pouvez pas ajouter plus de 2 PDF')
            return
        }
        
        if (imageCount > 1) {
            setFileError('Vous ne pouvez pas ajouter plus d\'une image')
            return
        }
        
        // Mettre à jour les fichiers courants
        setCurrentFiles(totalFiles)
        
        // Réinitialiser les champs du formulaire
        setValue('birthAct', null)
        setValue('nationalityCert', null)
        setValue('photo', null)
        
        // Réassigner les fichiers aux champs correspondants
        totalFiles.forEach(file => {
            const extension = file.name.split('.').pop()?.toLowerCase()
            
            if (extension === 'pdf') {
                if (!getValues('birthAct')) {
                    setValue('birthAct', file)
                } else if (!getValues('nationalityCert')) {
                    setValue('nationalityCert', file)
                }
            } else if (['png', 'jpg', 'jpeg'].includes(extension || '')) {
                setValue('photo', file)
            }
        })
        
        // Déclencher la validation
        trigger(['birthAct', 'nationalityCert', 'photo'])
    }

    const removeFile = (file: FileWithPath) => {
        const newFiles = currentFiles.filter(f => f !== file)
        setCurrentFiles(newFiles)
        
        // Réinitialiser les champs
        setValue('birthAct', null)
        setValue('nationalityCert', null)
        setValue('photo', null)
        
        // Réassigner les fichiers restants
        newFiles.forEach(f => {
            const extension = f.name.split('.').pop()?.toLowerCase()
            if (extension === 'pdf') {
                if (!getValues('birthAct')) {
                    setValue('birthAct', f)
                } else if (!getValues('nationalityCert')) {
                    setValue('nationalityCert', f)
                }
            } else if (['png', 'jpg', 'jpeg'].includes(extension || '')) {
                setValue('photo', f)
            }
        })
        
        trigger(['birthAct', 'nationalityCert', 'photo'])
    }

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-6">
                <h2 className="text-xl font-bold text-blue-100 mb-2">Documents requis</h2>
                <p className="text-blue-200/80 text-sm">
                    Veuillez fournir les documents suivants au format PDF ou image
                </p>
            </div>
            
            <DropzoneInput
                label="Déposez vos documents (2 PDF max et 1 image)"
                accept={['.pdf', '.png', '.jpg', '.jpeg']}
                onDrop={handleDrop}
                multiple
                maxFiles={3}
                disabled={currentFiles.length >= 3}
                value={currentFiles}
            />
            
            <AnimatePresence>
                {fileError && (
                    <motion.div 
                        className="bg-red-500/20 border border-red-400 rounded-lg p-3 text-red-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <p>{fileError}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <FilePreview 
                    label="Acte de naissance" 
                    file={getValues('birthAct')} 
                    onRemove={() => removeFile(getValues('birthAct'))}
                    required
                />
                <FilePreview 
                    label="Certificat de nationalité" 
                    file={getValues('nationalityCert')} 
                    onRemove={() => removeFile(getValues('nationalityCert'))}
                    required
                />
                <FilePreview 
                    label="Photo 4x4" 
                    file={getValues('photo')} 
                    onRemove={() => removeFile(getValues('photo'))}
                    required
                />
            </div>
        </motion.div>
    )
}

// Composant pour afficher les fichiers sélectionnés
const FilePreview = ({ 
  label, 
  file, 
  onRemove,
  required = false
}: { 
  label: string; 
  file: FileWithPath | null; 
  onRemove: () => void;
  required?: boolean;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [file])
  
  return (
    <motion.div 
      className={`
        rounded-xl p-4 flex flex-col h-full relative 
        overflow-hidden cursor-default
        bg-blue-900/30 backdrop-blur-sm
        border ${file ? 'border-blue-500/40' : 'border-blue-400/30'}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25)',
        borderColor: '#93c5fd'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-blue-100">
          {label}
          {required && <span className="text-amber-400 ml-1">*</span>}
        </h3>
        
        {file && (
          <motion.button
            type="button" 
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="text-amber-400 hover:text-amber-300 cursor-pointer"
            aria-label="Supprimer le fichier"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>
      
      <div className="mb-3 flex-1 flex items-center justify-center bg-blue-800/20 rounded-xl min-h-[160px]">
        {file ? (
          previewUrl ? (
            <div className="relative w-full h-40 overflow-hidden rounded-lg">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent" />
            </div>
          ) : (
            <motion.div 
              className="flex flex-col items-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FileText className="w-12 h-12 text-blue-300" strokeWidth={1.2} />
              <span className="text-sm text-blue-200 mt-2">Document PDF</span>
            </motion.div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-700/40 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-blue-300/70 text-sm">Aucun fichier</p>
            <p className="text-xs text-blue-400/60 mt-1">Cliquez pour ajouter</p>
          </div>
        )}
      </div>
      
      {file && (
        <motion.div 
          className="flex items-center justify-between mt-2 pt-2 border-t border-blue-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div 
            className="truncate text-sm text-blue-200"
            title={file.name}
          >
            {file.name}
            <span className="block text-xs text-blue-300/60 mt-1">
              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}