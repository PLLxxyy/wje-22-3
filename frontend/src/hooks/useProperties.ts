import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import { Property } from '@/types'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/properties')
      setProperties(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProperty = async (data: Partial<Property>) => {
    const res = await api.post('/properties', data)
    setProperties(prev => [res.data, ...prev])
    return res.data
  }

  const updateProperty = async (id: number, data: Partial<Property>) => {
    const res = await api.put(`/properties/${id}`, data)
    setProperties(prev => prev.map(p => p.id === id ? res.data : p))
    return res.data
  }

  const deleteProperty = async (id: number) => {
    await api.delete(`/properties/${id}`)
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { properties, loading, fetchProperties, createProperty, updateProperty, deleteProperty }
}
