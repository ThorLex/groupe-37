"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Supprimer le cookie d'authentification
    document.cookie = "authToken=; max-age=0; path=/";
    
    toast.success("Déconnexion réussie");
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Déconnexion en cours...</p>
      </div>
    </div>
  );
}