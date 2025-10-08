import { useState, useCallback } from 'react'

interface SelectedImage {
  id: string
  file: File
  name: string
  preview: string
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
}

const MAX_SIZE_MB = 5
const MAX_FILES = 3

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const addImages = useCallback((files: File[]) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) return false
      if (file.size > MAX_SIZE_MB * 1024 * 1024) return false
      return true
    })

    const newImages: SelectedImage[] = validFiles.map(file => ({
      id: `${Date.now()}-${file.name}`,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }))

    setSelectedImages(prev => [...prev, ...newImages].slice(0, MAX_FILES))
  }, [])

  const removeImage = useCallback((id: string) => {
    setSelectedImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) {
        URL.revokeObjectURL(img.preview)
      }
      return prev.filter(i => i.id !== id)
    })
  }, [])

  const clearImages = useCallback(() => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.preview))
    setSelectedImages([])
  }, [selectedImages])

  const uploadImages = useCallback(async (): Promise<string[] | null> => {
    if (selectedImages.length === 0) return null

    setIsUploading(true)
    const imageUrls: string[] = []

    try {
      for (const image of selectedImages) {
        setSelectedImages(prev =>
          prev.map(img =>
            img.id === image.id ? { ...img, status: 'uploading' as const } : img
          )
        )

        const formData = new FormData()
        formData.append('image', image.file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()
        imageUrls.push(data.url)

        setSelectedImages(prev =>
          prev.map(img =>
            img.id === image.id ? { ...img, status: 'uploaded' as const } : img
          )
        )
      }

      return imageUrls
    } catch (error) {
      console.error('Error uploading images:', error)
      setSelectedImages(prev =>
        prev.map(img => ({ ...img, status: 'error' as const }))
      )
      return null
    } finally {
      setIsUploading(false)
    }
  }, [selectedImages])

  return {
    selectedImages,
    isUploading,
    addImages,
    removeImage,
    clearImages,
    uploadImages,
  }
}
