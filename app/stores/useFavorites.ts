interface FavoriteRocket {
	id: string
	name: string
	description: string
}

export const useFavorites = defineStore('favorites', {
	state: () => ({
		favorites: [] as FavoriteRocket[]
	}),

	getters: {
		favoritesCount: (state) => state.favorites.length,
		isFavorite: (state) => (id: string) => state.favorites.some(fav => fav.id === id)
	},

	actions: {
		addToFavorites(rocket: FavoriteRocket) {
			if (!this.favorites.some(fav => fav.id === rocket.id)) {
				this.favorites.push(rocket)
				this.saveToStorage()
			}
		},

		removeFromFavorites(id: string) {
			const index = this.favorites.findIndex(fav => fav.id === id)
			if (index > -1) {
				this.favorites.splice(index, 1)
				this.saveToStorage()
			}
		},

		clearFavorites() {
			this.favorites = []
			this.saveToStorage()
		},

		loadFromStorage() {
			if (process.client) {
				const stored = localStorage.getItem('spacex-favorites')
				if (stored) {
					try {
						this.favorites = JSON.parse(stored)
					} catch (error) {
						console.error('Error loading favorites from storage:', error)
					}
				}
			}
		},

		saveToStorage() {
			if (process.client) {
				localStorage.setItem('spacex-favorites', JSON.stringify(this.favorites))
			}
		}
	}
}) 