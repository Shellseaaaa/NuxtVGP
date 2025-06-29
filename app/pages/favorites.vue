<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-heart" />
			Favorite Rockets
		</h2>
		<h5>Your saved rocket collection</h5>

		<v-card class="mx-auto my-12" max-width="1200">
			<v-card-title class="text-blue">
				<v-icon icon="mdi-heart" class="me-2" />
				My Favorites
				<v-spacer />
				<v-btn 
					v-if="favorites.length > 0"
					color="error" 
					variant="outlined"
					@click="clearAllFavorites"
				>
					<v-icon icon="mdi-delete" class="me-2" />
					Clear All
				</v-btn>
			</v-card-title>

			<v-card-text>
				<div v-if="favorites.length === 0" class="text-center pa-8">
					<v-icon icon="mdi-heart-outline" color="grey" size="64" />
					<div class="mt-4 text-grey">No favorite rockets yet</div>
					<div class="text-body-2 mt-2">
						Explore launches and add rockets to your favorites!
					</div>
					<v-btn 
						color="primary" 
						variant="outlined"
						class="mt-4"
						@click="navigateTo('/launches')"
					>
						<v-icon icon="mdi-rocket" class="me-2" />
						Browse Launches
					</v-btn>
				</div>

				<div v-else>
					<v-row>
						<v-col 
							v-for="rocket in favorites" 
							:key="rocket.id" 
							cols="12" 
							md="6" 
							lg="4"
						>
							<v-card variant="outlined" height="100%">
								<v-card-title class="text-h6">
									<v-icon icon="mdi-rocket" class="me-2" />
									{{ rocket.name }}
								</v-card-title>

								<v-card-text>
									<div v-if="rocket.description" class="text-body-2">
										{{ truncateText(rocket.description, 150) }}
									</div>
									<div v-else class="text-grey">
										No description available
									</div>
								</v-card-text>

								<v-card-actions>
									<v-btn 
										color="error" 
										variant="text"
										size="small"
										@click="removeFromFavorites(rocket.id)"
									>
										<v-icon icon="mdi-heart-off" class="me-1" />
										Remove
									</v-btn>
									<v-spacer />
									<v-btn 
										color="primary" 
										variant="outlined"
										size="small"
										@click="viewRocketDetails(rocket.id)"
									>
										<v-icon icon="mdi-information" class="me-1" />
										Details
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-col>
					</v-row>
				</div>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts" setup>
const favoritesStore = useFavorites()

const favorites = computed(() => favoritesStore.favorites)

const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) return text
	return text.substring(0, maxLength) + '...'
}

const removeFromFavorites = (id: string) => {
	favoritesStore.removeFromFavorites(id)
}

const clearAllFavorites = () => {
	favoritesStore.clearFavorites()
}

const viewRocketDetails = (id: string) => {
	navigateTo(`/rockets/${id}`)
}
</script> 