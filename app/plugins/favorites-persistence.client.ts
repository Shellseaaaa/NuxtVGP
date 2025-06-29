export default defineNuxtPlugin(() => {
	const favoritesStore = useFavorites()
	
	// Load favorites from localStorage on app initialization
	favoritesStore.loadFromStorage()
}) 