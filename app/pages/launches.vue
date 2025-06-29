<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-rocket-launch" />
			SpaceX Launches
		</h2>
		<h5>Explore all SpaceX missions</h5>

		<v-card class="mx-auto my-12" max-width="1200">
			<v-card-title class="text-blue">
				<v-icon icon="mdi-rocket" class="me-2" />
				Launch Missions
			</v-card-title>

			<v-card-text>
				<!-- Filters and Sorting -->
				<v-row class="mb-4">
					<v-col cols="12" sm="6" md="4">
						<v-select
							v-model="selectedYear"
							:items="yearOptions"
							label="Filter by Year"
							variant="outlined"
							density="compact"
						/>
					</v-col>
					<v-col cols="12" sm="6" md="4">
						<v-select
							v-model="sortOrder"
							:items="[
								{ title: 'Newest First', value: 'desc' },
								{ title: 'Oldest First', value: 'asc' }
							]"
							label="Sort by Date"
							variant="outlined"
							density="compact"
						/>
					</v-col>
					<v-col cols="12" sm="6" md="4" class="d-flex align-center">
						<v-chip color="info" variant="outlined">
							{{ filteredAndSortedLaunches.length }} launches
						</v-chip>
					</v-col>
				</v-row>

				<div v-if="pending" class="text-center pa-8">
					<v-progress-circular indeterminate color="primary" size="64" />
					<div class="mt-4">Loading launches...</div>
				</div>

				<div v-else-if="error" class="text-center pa-8">
					<v-icon icon="mdi-alert-circle" color="error" size="64" />
					<div class="mt-4 text-error">Error loading launches</div>
				</div>

				<div v-else>
					<v-table>
						<thead>
							<tr>
								<th class="text-left">Mission</th>
								<th class="text-left">Launch Date</th>
								<th class="text-left">Launch Site</th>
								<th class="text-left">Rocket</th>
								<th class="text-left">Details</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="launch in filteredAndSortedLaunches" :key="launch.id">
								<td>
									<v-chip color="primary" variant="outlined">
										{{ launch.mission_name }}
									</v-chip>
								</td>
								<td>
									{{ formatDate(launch.launch_date_local) }}
								</td>
								<td>
									<v-chip :color="launch.launch_site?.site_name ? 'green' : 'grey'" size="small">
										{{ launch.launch_site?.site_name || 'N/A' }}
									</v-chip>
								</td>
								<td>
									<v-chip 
										color="blue" 
										size="small"
										@click="viewRocketDetails(launch.rocket?.rocket?.id)"
										style="cursor: pointer"
									>
										{{ launch.rocket?.rocket_name || 'N/A' }}
									</v-chip>
								</td>
								<td>
									<div v-if="launch.details" class="text-body-2" style="max-width: 300px;">
										{{ truncateText(launch.details, 100) }}
									</div>
									<div v-else class="text-grey">
										No details available
									</div>
								</td>
							</tr>
						</tbody>
					</v-table>
				</div>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts" setup>
const selectedYear = ref<string>('all')
const sortOrder = ref<'asc' | 'desc'>('desc')

const query = gql`
	query getLaunches {
		launches {
			id
			mission_name
			launch_date_local
			launch_site {
				site_name
			}
			rocket {
				rocket_name
				rocket {
					id
				}
			}
			details
		}
	}
`

const { data, pending, error } = useAsyncQuery<{
	launches: {
		id: string
		mission_name: string
		launch_date_local: string
		launch_site: {
			site_name: string
		}
		rocket: {
			rocket_name: string
			rocket: {
				id: string
			}
		}
		details: string
	}[]
}>(query)

const launches = computed(() => data.value?.launches ?? [])

// Extract available years for filtering
const availableYears = computed(() => {
	const years: string[] = []
	launches.value.forEach(launch => {
		const year = new Date(launch.launch_date_local).getFullYear().toString()
		let found = false
		for (let i = 0; i < years.length; i++) {
			if (years[i] === year) {
				found = true
				break
			}
		}
		if (!found) {
			years.push(year)
		}
	})
	return years.sort((a, b) => parseInt(b) - parseInt(a))
})

const yearOptions = computed(() => {
	const options = [{ title: 'All Years', value: 'all' }]
	availableYears.value.forEach(year => {
		options.push({ title: year, value: year })
	})
	return options
})

// Filter launches by year
const filteredLaunches = computed(() => {
	if (selectedYear.value === 'all') return launches.value
	return launches.value.filter(launch => {
		const launchYear = new Date(launch.launch_date_local).getFullYear().toString()
		return launchYear === selectedYear.value
	})
})

// Sort launches by date
const filteredAndSortedLaunches = computed(() => {
	return [...filteredLaunches.value].sort((a, b) => {
		const dateA = new Date(a.launch_date_local).getTime()
		const dateB = new Date(b.launch_date_local).getTime()
		
		if (sortOrder.value === 'asc') {
			return dateA - dateB
		} else {
			return dateB - dateA
		}
	})
})

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) return text
	return text.substring(0, maxLength) + '...'
}

const viewRocketDetails = (rocketId: string) => {
	if (rocketId) {
		navigateTo(`/rockets/${rocketId}`)
	}
}
</script> 