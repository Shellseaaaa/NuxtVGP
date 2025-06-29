<template>
	<v-app>
		<!-- Navigation Bar -->
		<v-app-bar app color="primary" dark>
			<v-app-bar-title>
				<v-icon icon="mdi-rocket-launch" class="me-2" />
				SpaceX Explorer
			</v-app-bar-title>

			<v-spacer />

			<v-btn 
				variant="text" 
				:to="{ name: 'index' }"
				:active="route.name === 'index'"
			>
				<v-icon icon="mdi-home" class="me-1" />
				Home
			</v-btn>

			<v-btn 
				variant="text" 
				:to="{ name: 'launches' }"
				:active="route.name === 'launches'"
			>
				<v-icon icon="mdi-rocket" class="me-1" />
				Launches
			</v-btn>

			<v-btn 
				variant="text" 
				:to="{ name: 'favorites' }"
				:active="route.name === 'favorites'"
			>
				<v-icon icon="mdi-heart" class="me-1" />
				Favorites
				<v-badge 
					v-if="favoritesCount > 0" 
					:content="favoritesCount" 
					color="error" 
					class="ms-1"
				/>
			</v-btn>
		</v-app-bar>

		<!-- Main Content -->
		<v-main>
			<slot />
		</v-main>

		<!-- Footer -->
		<v-footer app color="grey-darken-3" dark>
			<v-container>
				<v-row align="center" justify="center">
					<v-col cols="12" class="text-center">
						<div class="text-body-2">
							<v-icon icon="mdi-rocket-launch" class="me-1" />
							SpaceX Explorer - Built with Nuxt 3, Vuetify, GraphQL & Pinia
						</div>
						<div class="text-caption mt-2">
							Data provided by SpaceX GraphQL API
						</div>
					</v-col>
				</v-row>
			</v-container>
		</v-footer>
	</v-app>
</template>

<script lang="ts" setup>
const route = useRoute()
const favoritesStore = useFavorites()

const favoritesCount = computed(() => favoritesStore.favorites.length)
</script>
