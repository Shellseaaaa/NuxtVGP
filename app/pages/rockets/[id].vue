<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-rocket" />
			Rocket Details
		</h2>
		<h5>Explore rocket specifications</h5>

		<div v-if="pending" class="text-center pa-8">
			<v-progress-circular indeterminate color="primary" size="64" />
			<div class="mt-4">Loading rocket details...</div>
		</div>

		<div v-else-if="error" class="text-center pa-8">
			<v-icon icon="mdi-alert-circle" color="error" size="64" />
			<div class="mt-4 text-error">Error loading rocket details</div>
		</div>

		<div v-else-if="rocket" class="mx-auto my-12" style="max-width: 800px;">
			<v-card>
				<v-card-title class="text-blue">
					<v-icon icon="mdi-rocket" class="me-2" />
					{{ rocket.name }}
				</v-card-title>

				<v-card-text>
					<v-row>
						<v-col cols="12" md="6">
							<v-card variant="outlined" class="mb-4">
								<v-card-title class="text-h6">Basic Information</v-card-title>
								<v-card-text>
									<v-list>
										<v-list-item>
											<template #prepend>
												<v-icon icon="mdi-calendar" color="primary" />
											</template>
											<v-list-item-title>First Flight</v-list-item-title>
											<v-list-item-subtitle>
												{{ formatDate(rocket.first_flight) }}
											</v-list-item-subtitle>
										</v-list-item>

										<v-list-item>
											<template #prepend>
												<v-icon icon="mdi-layers" color="primary" />
											</template>
											<v-list-item-title>Stages</v-list-item-title>
											<v-list-item-subtitle>
												{{ rocket.stages }} stage{{ rocket.stages !== 1 ? 's' : '' }}
											</v-list-item-subtitle>
										</v-list-item>

										<v-list-item>
											<template #prepend>
												<v-icon icon="mdi-check-circle" color="primary" />
											</template>
											<v-list-item-title>Status</v-list-item-title>
											<v-list-item-subtitle>
												<v-chip :color="rocket.active ? 'green' : 'red'" size="small">
													{{ rocket.active ? 'Active' : 'Inactive' }}
												</v-chip>
											</v-list-item-subtitle>
										</v-list-item>
									</v-list>
								</v-card-text>
							</v-card>
						</v-col>

						<v-col cols="12" md="6">
							<v-card variant="outlined" class="mb-4">
								<v-card-title class="text-h6">Dimensions</v-card-title>
								<v-card-text>
									<v-list>
										<v-list-item>
											<template #prepend>
												<v-icon icon="mdi-arrow-up-down" color="primary" />
											</template>
											<v-list-item-title>Height</v-list-item-title>
											<v-list-item-subtitle>
												{{ rocket.height?.meters || 'N/A' }} meters
												({{ rocket.height?.feet || 'N/A' }} feet)
											</v-list-item-subtitle>
										</v-list-item>

										<v-list-item>
											<template #prepend>
												<v-icon icon="mdi-arrow-left-right" color="primary" />
											</template>
											<v-list-item-title>Diameter</v-list-item-title>
											<v-list-item-subtitle>
												{{ rocket.diameter?.meters || 'N/A' }} meters
												({{ rocket.diameter?.feet || 'N/A' }} feet)
											</v-list-item-subtitle>
										</v-list-item>

										<v-list-item>
											<template #prepend>
												<v-icon icon="mdi-weight" color="primary" />
											</template>
											<v-list-item-title>Mass</v-list-item-title>
											<v-list-item-subtitle>
												{{ formatMass(rocket.mass?.kg) }} kg
												({{ formatMass(rocket.mass?.lb) }} lb)
											</v-list-item-subtitle>
										</v-list-item>
									</v-list>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>

					<v-card variant="outlined">
						<v-card-title class="text-h6">Description</v-card-title>
						<v-card-text>
							<div v-if="rocket.description" class="text-body-1">
								{{ rocket.description }}
							</div>
							<div v-else class="text-grey">
								No description available for this rocket.
							</div>
						</v-card-text>
					</v-card>

					<v-card-actions class="mt-4">
						<v-btn 
							color="primary" 
							variant="outlined"
							@click="addToFavorites"
							:disabled="isInFavorites"
						>
							<v-icon icon="mdi-heart" class="me-2" />
							{{ isInFavorites ? 'Added to Favorites' : 'Add to Favorites' }}
						</v-btn>
						<v-btn 
							color="secondary" 
							variant="outlined"
							@click="navigateTo('/launches')"
						>
							<v-icon icon="mdi-arrow-left" class="me-2" />
							Back to Launches
						</v-btn>
					</v-card-actions>
				</v-card-text>
			</v-card>
		</div>

		<div v-else class="text-center pa-8">
			<v-icon icon="mdi-rocket-off" color="grey" size="64" />
			<div class="mt-4 text-grey">Rocket not found</div>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
const route = useRoute()
const rocketId = route.params.id as string

const favoritesStore = useFavorites()

const query = gql`
	query getRocket($id: ID!) {
		rocket(id: $id) {
			id
			name
			description
			first_flight
			height {
				meters
				feet
			}
			diameter {
				meters
				feet
			}
			mass {
				kg
				lb
			}
			stages
			active
		}
	}
`

const { data, pending, error } = useAsyncQuery<{
	rocket: {
		id: string
		name: string
		description: string
		first_flight: string
		height: {
			meters: number
			feet: number
		}
		diameter: {
			meters: number
			feet: number
		}
		mass: {
			kg: number
			lb: number
		}
		stages: number
		active: boolean
	}
}>(query, { id: rocketId })

const rocket = computed(() => data.value?.rocket)

const isInFavorites = computed(() => {
	return favoritesStore.favorites.some(fav => fav.id === rocketId)
})

const formatDate = (dateString: string) => {
	if (!dateString) return 'N/A'
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

const formatMass = (mass: number | undefined) => {
	if (!mass) return 'N/A'
	return mass.toLocaleString()
}

const addToFavorites = () => {
	if (rocket.value) {
		favoritesStore.addToFavorites({
			id: rocket.value.id,
			name: rocket.value.name,
			description: rocket.value.description
		})
	}
}
</script> 