// stores/newsletter.ts
import { defineStore } from 'pinia'

export const useNewsletterStore = defineStore('newsletter', () => {
  const config = useRuntimeConfig()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Meldet einen Benutzer zum Newsletter an
   * @param email Die E-Mail-Adresse des Benutzers
   * @returns Promise mit dem Ergebnis
   */
  async function subscribeToNewsletter(email: string) {
    isLoading.value = true
    error.value = null

    try {
      // Generiere einen zufälligen Bestätigungstoken
      const confirmationToken = generateToken()

      // Hole Strapi URL und Token aus den Environment-Variablen
      const strapiUrl = config.public.strapiUrl || import.meta.env.VITE_STRAPI_URL
      const strapiToken = config.public.strapiToken || import.meta.env.VITE_STRAPI_TOKEN

      // Sende die Daten an Strapi mit Bearer Token
      const response = await $fetch('/api/subscribers', {
        method: 'POST',
        baseURL: strapiUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`,
        },
        body: {
          data: {
            email: email.toLowerCase().trim(),
            confirmationToken,
            confirmed: false,
            blocked: false,
            subscribtiondate: new Date().toISOString(),
          },
        },
      })

      return response
    } catch (err: any) {
      // Prüfe ob E-Mail bereits existiert
      if (err.statusCode === 400 || err.response?.status === 400) {
        error.value = 'Diese E-Mail-Adresse ist bereits registriert.'
      } else if (err.statusCode === 401 || err.response?.status === 401) {
        error.value = 'Authentifizierungsfehler. Bitte kontaktiere den Support.'
      } else {
        error.value = 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
      }
      console.error('Newsletter-Anmeldung fehlgeschlagen:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Bestätigt eine Newsletter-Anmeldung mit Token
   * @param token Der Bestätigungstoken
   */
  async function confirmSubscription(token: string) {
    isLoading.value = true
    error.value = null

    if (!token) {
      error.value = 'Kein Bestätigungscode übergeben.'
      isLoading.value = false
      return false
    }

    try {
      const strapiUrl = config.public.strapiUrl || import.meta.env.VITE_STRAPI_URL
      const strapiToken = config.public.strapiToken || import.meta.env.VITE_STRAPI_TOKEN

      // Subscriber mit Token suchen
      const subscribers: any = await $fetch('/api/subscribers', {
        method: 'GET',
        baseURL: strapiUrl,
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
        },
        query: {
          'filters[confirmationToken][$eq]': token,
          'pagination[pageSize]': 1 // nur 1 Ergebnis nötig
        },
      })

      if (!subscribers.data || subscribers.data.length === 0) {
        error.value = 'Ungültiger Bestätigungscode. Bitte überprüfe den Code.'
        return false
      }

      const subscriber = subscribers.data[0]

      if (subscriber.attributes?.confirmed) {
        error.value = 'Diese E-Mail-Adresse wurde bereits bestätigt.'
        return false
      }

      // Subscriber bestätigen
      await $fetch(`/api/subscribers/${subscriber.documentId}`, {
        method: 'PUT',
        baseURL: strapiUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`,
        },
        body: {
          data: {
            confirmed: true,
            confirmationToken: null
          },
        },
      })

      return true
    } catch (err: any) {
      error.value = 'Bestätigung fehlgeschlagen. Bitte versuche es erneut.'
      console.error('Newsletter-Bestätigung fehlgeschlagen:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }


  /**
   * Generiert einen zufälligen Token
   */
  function generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36)
  }

  return {
    isLoading,
    error,
    subscribeToNewsletter,
    confirmSubscription,
  }
})