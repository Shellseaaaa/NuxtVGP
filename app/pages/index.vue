<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-rocket-launch" />
			SpaceX Explorer
		</h2>
		<h5>Nuxt 3 / Vuetify / GraphQL / Pinia</h5>

		<!-- Welcome Section -->
		<v-card class="mx-auto my-12" max-width="800">
			<v-card-title class="text-blue">
				<v-icon icon="mdi-rocket" class="me-2" />
				Welcome to SpaceX Explorer
			</v-card-title>
			<v-card-text>
				<div class="text-body-1">
					Explore SpaceX launches, rocket details, and manage your favorite rockets. 
					This application demonstrates modern web development with Nuxt 3, Vuetify, GraphQL, and Pinia.
				</div>
			</v-card-text>
			<v-card-actions>
				<v-btn color="primary" @click="navigateTo('/launches')">
					<v-icon icon="mdi-rocket" class="me-2" />
					Explore Launches
				</v-btn>
				<v-btn color="secondary" variant="outlined" @click="navigateTo('/favorites')">
					<v-icon icon="mdi-heart" class="me-2" />
					View Favorites
				</v-btn>
			</v-card-actions>
		</v-card>

		<!-- Launch Countdown -->
		<LaunchCountdown />

		<!-- Features Section -->
		<v-row>
			<v-col cols="12" md="4">
				<v-card class="mx-auto my-12" max-width="374">
					<v-card-title class="text-blue">
						<v-icon icon="mdi-rocket" class="me-2" />
						Launch Missions
					</v-card-title>
					<v-card-text>
						Browse all SpaceX launches with detailed information including mission names, 
						launch dates, sites, and rocket specifications. Filter by year and sort by date.
					</v-card-text>
					<v-card-actions>
						<v-btn color="primary" @click="navigateTo('/launches')">
							View Launches
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="mx-auto my-12" max-width="374">
					<v-card-title class="text-blue">
						<v-icon icon="mdi-heart" class="me-2" />
						Favorite Rockets
					</v-card-title>
					<v-card-text>
						Save your favorite rockets and access them anytime. 
						Manage your collection with easy add/remove functionality.
					</v-card-text>
					<v-card-actions>
						<v-btn color="primary" @click="navigateTo('/favorites')">
							View Favorites
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="mx-auto my-12" max-width="374">
					<v-card-title class="text-blue">
						<v-icon icon="mdi-chart-line" class="me-2" />
						Real-time Data
					</v-card-title>
					<v-card-text>
						All data is fetched in real-time from the SpaceX GraphQL API. 
						Experience the latest launch information and rocket details.
					</v-card-text>
					<v-card-actions>
						<v-btn color="primary" @click="navigateTo('/launches')">
							Explore Data
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<!-- Example Pinia Store -->
		<h3 class="my-5">
			Example Pinia
			<v-chip color="blue">useCounter</v-chip>
		</h3>
		<v-card class="mx-auto my-12" max-width="374">
			<v-card-title class="text-blue">Pinia useCounter()</v-card-title>
			<v-card-item>
				<v-card-text>
					<v-chip>count:</v-chip>
					{{ store.count }}
				</v-card-text>
				<v-card-text>
					<v-chip>doubleCount:</v-chip>
					{{ store.doubleCount }}
				</v-card-text>
			</v-card-item>

			<v-card-actions><v-btn color="blue" @click="store.increment()">Increment</v-btn></v-card-actions>
		</v-card>

		<!-- Example GraphQL Data -->
		<h3 class="my-5">
			Example GraphQL
			<v-chip color="orange">SpaceX Ships Data</v-chip>
		</h3>
		<p>There are {{ ships?.length || 0 }} ships.</p>
		<v-table>
			<thead>
				<tr>
					<th class="text-left">Name</th>
					<th class="text-left">Active</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="ship in ships" :key="ship.name">
					<td>{{ ship.name }}</td>
					<td>
						<v-chip :color="ship.active ? 'green' : 'red'">{{ ship.active }}</v-chip>
					</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>
<script lang="ts" setup>
const store = useCounter()
const selection = ref(0)
const query = gql`
	query getShips {
		ships {
			id
			name
			active
		}
	}
`
const { data } = useAsyncQuery<{
	ships: {
		id: string
		name: string
		active: boolean
	}[]
}>(query)
const ships = computed(() => data.value?.ships ?? [])
</script>
