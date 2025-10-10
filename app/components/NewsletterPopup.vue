<template>
  <div v-if="showPopup" class="newsletter-popup-overlay" @click.self="closePopup">
    <div class="newsletter-popup">
      <button class="close-button" @click="closePopup" aria-label="Schließen">
        ×
      </button>
      
      <div class="popup-content">
        <div class="background-svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 577 737 696" fill="none">
            <path d="M169.847,626.994C309.047,564.864,463.327,567.254,519.007,598.318C699.200,698.851,746.367,1009.329,643.127,1173.017C584.924,1265.299,550.300,1244.110,492.327,1257.847C401.890,1279.278,276.227,1289.452,81.687,1207.666C-53.788,1150.711,8.606,1060.705,-29.674,868.343C-65.416,688.735,-10.616,707.540,169.847,626.994Z" style="fill: rgb(181, 208, 203); fill-opacity: 0.95;" />
          </svg>
        </div>
        
        <div class="newsletter-form">
          <h2 v-if="!isSuccess">Du möchtest nichts mehr verpassen?</h2>
          <p v-if="!isSuccess && !errorMessage">Dann melde dich jetzt zu unserem <b>kostenlosen Newsletter</b> an!</p>
          <p v-if="isSuccess" class="success-message">Vielen Dank! Du wirst in Kürze eine Bestätigungs-E-Mail erhalten.</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          
          <form v-if="!isSuccess" @submit.prevent="submitNewsletter">
            <div class="form-group">
              <input 
                v-model="email" 
                type="email" 
                placeholder="Deine E-Mail-Adresse"
                required
                class="email-input"
                :disabled="isSubmitting"
                @blur="validateEmail"
              />
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                {{ isSubmitting ? 'Wird angemeldet...' : 'Anmelden' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PopupData {
  popup_shows: number
  last_popup_date: string
  newsletter_subscribed: boolean
}

interface Props {
  showAfterSeconds?: number
  maxShowsPerDay?: number
  allowedPages?: string[]
  disableAutoShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAfterSeconds: 5,
  maxShowsPerDay: 1,
  allowedPages: undefined,
  disableAutoShow: false
})

const showPopup = ref(false)
const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const route = useRoute()

// Newsletter Store importieren
const newsletterStore = useNewsletterStore()

const STORAGE_KEY = 'newsletter_popup_data'

// Funktion zum manuellen Öffnen des PopUps
function openPopup() {
  showPopup.value = true
  errorMessage.value = ''
  isSuccess.value = false
}

// Funktion für externe Nutzung bereitstellen
defineExpose({ openPopup })

// Verbesserte E-Mail-Validierung
function isValidEmail(email: string): boolean {
  if (!email) return false
  
  // Grundlegendes E-Mail-Format prüfen
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return false
  }
  
  // Zusätzliche Prüfung: Mindestens einen Punkt in der Domain nach dem @
  const atIndex = email.indexOf('@')
  if (atIndex === -1) return false
  
  const domainPart = email.substring(atIndex + 1)
  
  // Prüfen ob Domain mindestens einen Punkt enthält
  // UND nach dem letzten Punkt noch Zeichen folgen (TLD)
  const lastDotIndex = domainPart.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === domainPart.length - 1) {
    return false
  }
  
  // Prüfen ob zwischen @ und erstem Punkt Zeichen vorhanden sind
  const firstDotIndex = domainPart.indexOf('.')
  if (firstDotIndex <= 0) {
    return false
  }
  
  return true
}

// E-Mail-Validierung bei Blur-Event
function validateEmail(): void {
  if (email.value.trim() && !isValidEmail(email.value)) {
    errorMessage.value = 'Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@domain.de)'
  } else {
    errorMessage.value = ''
  }
}

onMounted(() => {
  if (!process.client) return
  
  // Wenn automatisches Anzeigen deaktiviert ist, nicht automatisch anzeigen
  if (props.disableAutoShow) {
    return
  }
  
  // Prüfen ob aktuelle Seite erlaubt ist
  if (!isPageAllowed()) {
    return
  }
  
  const popupData = getPopupData()
  
  // Prüfen ob bereits zum Newsletter angemeldet
  if (popupData.newsletter_subscribed) {
    return
  }
  
  // Prüfen ob heute bereits genug oft angezeigt
  if (!canShowPopup(popupData)) {
    return
  }
  
  // PopUp nach gewünschter Zeit anzeigen
  setTimeout(() => {
    showPopup.value = true
    incrementShowCount()
  }, props.showAfterSeconds * 1000)
})

function isPageAllowed(): boolean {
  if (!props.allowedPages || props.allowedPages.length === 0) {
    return true // Alle Seiten erlaubt wenn nichts angegeben
  }
  
  const currentPath = route.path
  
  return props.allowedPages.some(allowedPage => {
    // Normalisiere die Pfade (entferne führende/nachfolgende Slashes)
    const normalizedAllowed = allowedPage.replace(/^\/+|\/+$/g, '')
    const normalizedCurrent = currentPath.replace(/^\/+|\/+$/g, '')
    
    // Prüfe ob aktueller Pfad mit erlaubtem Pfad beginnt
    return normalizedCurrent === normalizedAllowed || 
           normalizedCurrent.startsWith(normalizedAllowed + '/')
  })
}

function getPopupData(): PopupData {
  if (!process.client) return getDefaultPopupData()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as PopupData
    }
  } catch (error) {
    console.error('Fehler beim Laden der PopUp-Daten:', error)
  }
  
  return getDefaultPopupData()
}

function getDefaultPopupData(): PopupData {
  return {
    popup_shows: 0,
    last_popup_date: '',
    newsletter_subscribed: false
  }
}

function savePopupData(data: PopupData): void {
  if (!process.client) return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Fehler beim Speichern der PopUp-Daten:', error)
  }
}

function canShowPopup(popupData: PopupData): boolean {
  const today = new Date().toDateString()
  
  // Wenn heute ein neuer Tag ist, Counter zurücksetzen
  if (popupData.last_popup_date !== today) {
    popupData.popup_shows = 0
    popupData.last_popup_date = today
    savePopupData(popupData)
    return true
  }
  
  // Prüfen ob Maximum für heute noch nicht erreicht
  return popupData.popup_shows < props.maxShowsPerDay
}

function incrementShowCount(): void {
  const popupData = getPopupData()
  popupData.popup_shows += 1
  popupData.last_popup_date = new Date().toDateString()
  savePopupData(popupData)
}

function closePopup(): void {
  showPopup.value = false
  errorMessage.value = ''
}

async function submitNewsletter(): Promise<void> {
  if (!email.value.trim()) return
  
  // E-Mail vor dem Absenden validieren
  if (!isValidEmail(email.value)) {
    errorMessage.value = 'Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@domain.de)'
    return
  }
  
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    // Newsletter-Anmeldung über Pinia Store
    await newsletterStore.subscribeToNewsletter(email.value)
    
    // Newsletter-Anmeldung im localStorage markieren
    const popupData = getPopupData()
    popupData.newsletter_subscribed = true
    savePopupData(popupData)
    
    // Success-Status anzeigen
    isSuccess.value = true
    
    // PopUp nach 5 Sekunden schließen
    setTimeout(() => {
      showPopup.value = false
    }, 5000)
    
  } catch (error: any) {
    console.error('Fehler bei Newsletter-Anmeldung:', error)
    
    // Zeige Fehlermeldung aus dem Store oder eine generische
    if (newsletterStore.error) {
      errorMessage.value = newsletterStore.error
    } else {
      errorMessage.value = 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="sass" scoped>
.newsletter-popup-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  backdrop-filter: blur(4px)
  display: flex
  align-items: center
  justify-content: center
  z-index: 9999
  animation: fadeIn 0.3s ease-out

.newsletter-popup
  position: relative
  max-width: 800px
  width: 80%  
  aspect-radio: 1 / 1
  overflow: hidden
  animation: slideUp 0.4s ease-out

.close-button
  position: absolute
  top: 1rem
  right: 1.2rem
  background: rgba(255, 255, 255, 0.9)
  border: none
  border-radius: 50%
  width: 3rem
  height: 3rem
  font-size: 1.8rem
  font-weight: bold
  color: #333
  cursor: pointer
  z-index: 10
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.2s ease
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  
  &:hover
    background: rgba(255, 255, 255, 1)
    transform: scale(1.05)

.popup-content
  position: relative
  padding: 6rem 30%
  height: 100%
  display: flex
  align-items: center
  justify-content: center

.background-svg
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 1
  
  svg
    width: 100%
    height: 100%
    object-fit: cover

.newsletter-form
  position: relative
  z-index: 2
  text-align: center
  width: 100%
  max-width: 400px

  
  h2
    font-size: 2.2rem
    font-weight: 700
    color: white
    margin: 0 0 1rem 0
    
  p
    font-size: 18px
    color: white 
    margin: 0 0 1rem 0
    line-height: 1.4

.success-message
  font-weight: 600
  font-size: 1.2rem
  padding: 1rem 10%

.error-message
  font-weight: 600
  color: #c41e3a !important
  background: rgba(255, 255, 255, 0.4)
  padding: 12px 20px
  border-radius: 10px
  margin-bottom: 20px

.form-group
  display: flex
  flex-direction: column
  gap: 1rem

.email-input
  width: 100%
  padding: 1rem 2rem
  border: 3px solid rgba(255, 255, 255, 0.9)
  border-radius: 1.5rem
  font-size: 1.2rem
  outline: none
  background: rgba(255, 255, 255, 0.95)
  transition: all 0.2s ease
  color: #333 
  box-sizing: border-box
  
  &:focus
    border-color: rgba(255, 255, 255, 1)
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3)
    background: rgba(255, 255, 255, 1)
  
  &:disabled
    opacity: 0.6
    cursor: not-allowed
  
  &::placeholder
    color: #666

.submit-button
  width: 100%
  padding: 1rem 2rem
  background: rgba(44, 86, 81, 0.9)
  color: white
  border: none
  border-radius: 1.5rem
  font-size: 1.2rem
  font-weight: 600
  cursor: pointer
  transition: all 0.2s ease
  
  &:hover:not(:disabled)
    background: rgba(44, 86, 81, 1)
    transform: translateY(-2px)
    box-shadow: 0 6px 16px rgba(44, 86, 81, 0.4)
  
  &:disabled
    opacity: 0.7
    cursor: not-allowed
    transform: none

@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

@keyframes slideUp
  from
    opacity: 0
    transform: translateY(30px) scale(0.95)
  to
    opacity: 1
    transform: translateY(0) scale(1)

// Responsive Design
@media (max-width: 650px)
  .newsletter-popup   
  
  .popup-content
    padding: 6rem 10%
  
  .newsletter-form h2
    font-size: 1.4rem
    margin-bottom: 0.5rem
    margin-top: 1rem
  
  .newsletter-form p
    font-size: 1.1rem
    margin-bottom: 0.5rem
  
  .email-input, .submit-button
    padding: .8rem 1.6rem
    font-size: 1.1rem

@media (max-width: 460px)
  .popup-content
      padding: 5rem 10%

  .email-input, .submit-button
    padding: .5rem 1rem
    margin: 0 5%
    width: 90%
    font-size: 1rem

  .newsletter-form h2
    font-size: 1.2rem

  .newsletter-form p
    font-size: 1rem

</style>