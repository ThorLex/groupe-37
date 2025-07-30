import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 0 // Désactiver le cache

export async function GET() {
  try {
    // 1. Statistiques du jour
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // Requêtes pour les stats du jour
    const [
      dailyRequests,
      processedRequests,
      rejectedRequests
    ] = await Promise.all([
      // Demandes aujourd'hui
      supabase
        .from('pre_enrollment')
        .select('*', { count: 'exact', head: true })
        .gte('initiationdate', startOfDay)
        .lte('initiationdate', endOfDay),

      // Demandes traitées (approuvées ou disponibles)
      supabase
        .from('pre_enrollment')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'available'])
        .gte('initiationdate', startOfDay)
        .lte('initiationdate', endOfDay),

      // Demandes rejetées
      supabase
        .from('pre_enrollment')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')
        .gte('initiationdate', startOfDay)
        .lte('initiationdate', endOfDay)
    ])

    // 2. Données pour le graphique (30 derniers jours)
    const chartStartDate = new Date()
    chartStartDate.setDate(chartStartDate.getDate() - 30)

    const { data: chartRawData } = await supabase
      .from('pre_enrollment')
      .select('initiationdate, status')
      .gte('initiationdate', chartStartDate.toISOString())

    // Préparer les données pour le graphique
    const chartData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i)) // 30 jours incluant aujourd'hui
      const dateStr = date.toISOString().split('T')[0]
      
      return {
        date: dateStr,
        demandes: 0,
        traités: 0
      }
    })

    // Compter les demandes et les traités par jour
    chartRawData?.forEach(item => {
      const itemDate = item.initiationdate?.split('T')[0]
      const chartItem = chartData.find(d => d.date === itemDate)
      
      if (chartItem) {
        chartItem.demandes += 1
        
        // Compter comme "traité" si approuvé, disponible ou rejeté
        if (['approved', 'available', 'rejected'].includes(item.status)) {
          chartItem.traités += 1
        }
      }
    })

    // Formater la réponse
    const responseData = {
      dailyStats: {
        dailyRequests: dailyRequests.count || 0,
        processed: processedRequests.count || 0,
        rejected: rejectedRequests.count || 0
      },
      chartData
    }

    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    console.error('Erreur dashboard:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}