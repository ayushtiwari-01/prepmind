import { useEffect, useState } from "react"
import { getAnalyticsData } from "@/services/ai-service"
import { AnalyticsData } from "@/types"

export function useAnalyticsData() {

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function load() {

      try {

        const res = await getAnalyticsData()

        setData(res)

      } catch (e) {

        console.error(e)

      }

      setLoading(false)

    }

    load()

  }, [])

  return { data, loading }

}