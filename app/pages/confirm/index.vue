<template>
  <div class="confirm-container">
    <div class="confirm-card">
      <!-- Loading State -->
      <div v-if="isLoading" class="state-content">
        <div class="spinner"></div>
        <h1>Bestätigung läuft...</h1>
        <p>Bitte warte einen Moment, während wir deine Anmeldung bestätigen.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="isConfirmed" class="state-content success">
        <div class="icon-wrapper success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1>Newsletter-Anmeldung bestätigt!</h1>
        <p>Vielen Dank! Deine E-Mail-Adresse wurde erfolgreich bestätigt.</p>
        <p>Du erhältst ab sofort unseren Newsletter.</p>
        <NuxtLink to="/" class="btn btn-primary">
          Zur Startseite
        </NuxtLink>
      </div>

      <!-- Error State with Manual Input -->
      <div v-else-if="errorMessage" class="state-content error">
        <div class="icon-wrapper error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1>Bestätigung fehlgeschlagen</h1>
        <p class="error-text">{{ errorMessage }}</p>
        
        <form @submit.prevent="confirmWithManualToken" class="manual-token-form">
          <label for="manual-token">Bestätigungscode eingeben:</label>
          <input 
            id="manual-token"
            v-model="manualToken" 
            type="text" 
            placeholder="Gib deinen Bestätigungscode ein"
            class="token-input"
            :disabled="isLoading"
          />
          <div class="button-group">
            <button type="submit" class="btn btn-primary" :disabled="isLoading || !manualToken.trim()">
              {{ isLoading ? 'Wird bestätigt...' : 'Bestätigen' }}
            </button>
            <NuxtLink to="/" class="btn btn-secondary">
              Zur Startseite
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- No Token State with Manual Input -->
      <div v-else class="state-content warning">
        <div class="icon-wrapper warning-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h1>Newsletter-Anmeldung bestätigen</h1>
        <p>Gib den Bestätigungscode aus deiner E-Mail ein, um deine Anmeldung abzuschließen.</p>
        
        <form @submit.prevent="confirmWithManualToken" class="manual-token-form">
          <label for="manual-token-initial">Bestätigungscode:</label>
          <input 
            id="manual-token-initial"
            v-model="manualToken" 
            type="text" 
            placeholder="Gib deinen Bestätigungscode ein"
            class="token-input"
            :disabled="isLoading"
            required
          />
          <div class="button-group">
            <button type="submit" class="btn btn-primary" :disabled="isLoading || !manualToken.trim()">
              {{ isLoading ? 'Wird bestätigt...' : 'Bestätigen' }}
            </button>
            <NuxtLink to="/" class="btn btn-secondary">
              Zur Startseite
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const newsletterStore = useNewsletterStore()

const isLoading = ref(false)
const isConfirmed = ref(false)
const errorMessage = ref('')
const token = ref<string | null>(null)
const manualToken = ref('')

// SEO Meta Tags
useHead({
  title: 'Newsletter-Bestätigung',
  meta: [
    { name: 'description', content: 'Bestätige deine Newsletter-Anmeldung' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

onMounted(async () => {
  // Hole Token aus URL Query Parameter
  token.value = route.query.token as string || null

  // Wenn Token vorhanden ist, setze es auch ins manualToken Feld
  if (token.value) {
    manualToken.value = token.value
    // Starte automatische Bestätigung
    await confirmToken()
  }
})

async function confirmToken() {
  const tokenToConfirm = manualToken.value.trim() || token.value

  if (!tokenToConfirm) {
    errorMessage.value = 'Bitte gib einen gültigen Bestätigungscode ein.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  isConfirmed.value = false

  try {
    await newsletterStore.confirmSubscription(tokenToConfirm)
    isConfirmed.value = true
  } catch (error: any) {
    console.error('Bestätigung fehlgeschlagen:', error)
    
    // Setze Fehlermeldung
    if (newsletterStore.error) {
      errorMessage.value = newsletterStore.error
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Die Bestätigung ist fehlgeschlagen. Bitte überprüfe deinen Code und versuche es erneut.'
    }
  } finally {
    isLoading.value = false
  }
}

async function confirmWithManualToken() {
  await confirmToken()
}
</script>

<style lang="sass" scoped>
.confirm-container
  min-height: 100vh
  display: flex
  align-items: flex-start
  justify-content: center
  padding: 0rem 2rem 2rem
  background: white

.confirm-card
  background: white
  border-radius: 1.25rem
  padding: 3rem
  max-width: 37.5rem
  width: 100%
  box-shadow: 0 0.625rem 2.5rem rgba(0, 0, 0, 0.1)
  text-align: center

.state-content
  display: flex
  flex-direction: column
  align-items: center
  gap: 1.5rem

  h1
    font-size: 2rem
    font-weight: 700
    color: #333
    margin: 0
    line-height: 1.2

  p
    font-size: 1.1rem
    color: #666
    line-height: 1.6
    margin: 0

.icon-wrapper
  width: 5rem
  height: 5rem
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 1rem

.success-icon
  background: rgba(34, 197, 94, 0.1)
  color: #22c55e

.error-icon
  background: rgba(239, 68, 68, 0.1)
  color: #ef4444

.warning-icon
  background: rgba(251, 191, 36, 0.1)
  color: #fbbf24

.spinner
  width: 3.125rem
  height: 3.125rem
  border: 0.25rem solid rgba(44, 86, 81, 0.1)
  border-top-color: rgba(44, 86, 81, 0.8)
  border-radius: 50%
  animation: spin 1s linear infinite

.error-text
  color: #ef4444 !important
  font-weight: 600

.manual-token-form
  width: 100%
  display: flex
  flex-direction: column
  gap: 1rem
  margin-top: 1rem

  label
    font-size: 1rem
    font-weight: 600
    color: #333
    text-align: left

.token-input
  width: 100%
  padding: 1rem 1.5rem
  border: 0.125rem solid rgba(0, 0, 0, 0.1)
  border-radius: 0.75rem
  font-size: 1rem
  outline: none
  background: white
  transition: all 0.2s ease
  color: #333
  box-sizing: border-box
  font-family: monospace
  letter-spacing: 0.05rem

  &:focus
    border-color: rgba(44, 86, 81, 0.5)
    box-shadow: 0 0 0 0.1875rem rgba(44, 86, 81, 0.1)

  &:disabled
    opacity: 0.6
    cursor: not-allowed
    background: rgba(0, 0, 0, 0.02)

  &::placeholder
    color: #999
    letter-spacing: normal
    font-family: inherit

.btn
  display: inline-block
  padding: 0.875rem 2rem
  border-radius: 0.75rem
  font-size: 1rem
  font-weight: 600
  text-decoration: none
  transition: all 0.2s ease
  border: none
  cursor: pointer

.btn-primary
  background: rgba(44, 86, 81, 0.9)
  color: white

  &:hover:not(:disabled)
    background: rgba(44, 86, 81, 1)
    transform: translateY(-0.125rem)
    box-shadow: 0 0.375rem 1rem rgba(44, 86, 81, 0.4)

  &:disabled
    opacity: 0.6
    cursor: not-allowed
    transform: none

.btn-secondary
  background: rgba(181, 208, 203, 0.3)
  color: #2c5651

  &:hover
    background: rgba(181, 208, 203, 0.5)
    transform: translateY(-0.125rem)

.button-group
  display: flex
  gap: 1rem
  flex-wrap: wrap
  justify-content: center
  margin-top: 0.5rem

@keyframes spin
  to
    transform: rotate(360deg)

// Responsive Design
@media (max-width: 40.625rem)
  .confirm-container
    padding: 2rem 1rem 1rem

  .confirm-card
    padding: 2rem

  .state-content
    h1
      font-size: 1.5rem

    p
      font-size: 1rem

  .icon-wrapper
    width: 3.75rem
    height: 3.75rem

    svg
      width: 2.5rem
      height: 2.5rem

  .btn
    padding: 0.75rem 1.5rem
    font-size: 1rem

  .token-input
    font-size: 1rem

@media (max-width: 28.75rem)
  .confirm-container
    padding: 1.5rem 1rem 1rem

  .confirm-card
    padding: 1.5rem

  .state-content
    gap: 1rem

    h1
      font-size: 1.3rem

    p
      font-size: 1rem

  .button-group
    flex-direction: column
    width: 100%

    .btn
      width: 100%

  .token-input
    padding: 0.875rem 1.25rem
</style>