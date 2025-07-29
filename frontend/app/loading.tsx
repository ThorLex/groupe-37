export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="relative">
        {/* Logo animé */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center shadow-lg">
          <div className="absolute w-full h-full rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          <span className="text-2xl font-bold text-white tracking-tighter">ID</span>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-8 w-64 bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-green-600 h-2.5 rounded-full animate-progress"
            style={{ width: '45%' }}
          ></div>
        </div>
        
        {/* Texte */}
        <div className="mt-6 text-center">
          <p className="text-green-800 font-semibold text-lg">
            Préparation de votre service CNI...
          </p>
          <p className="text-gray-600 mt-2 text-sm max-w-md">
            IDEXPress sécurise votre demande de carte nationale d&lsquo;identité Camerounaise
          </p>
        </div>
        
        {/* Message secondaire */}
        <div className="mt-8">
          <p className="text-xs text-gray-500 animate-pulse">
            Chargement des services sécurisés...
          </p>
        </div>
      </div>
      
      {/* Pied de page institutionnel */}
      <div className="absolute bottom-6">
        <p className="text-xs text-gray-500">
          Ministère de l&lsquo;Administration Territoriale • République du Cameroun
        </p>
      </div>
    </div>
  );
}