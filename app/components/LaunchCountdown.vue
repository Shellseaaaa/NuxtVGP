<template>
	<v-card variant="outlined" class="mb-4">
		<v-card-title class="text-blue">
			<v-icon icon="mdi-timer" class="me-2" />
			Next Launch Countdown
		</v-card-title>
		<v-card-text>
			<div v-if="pending" class="text-center pa-4">
				<v-progress-circular indeterminate color="primary" size="32" />
				<div class="mt-2">Loading upcoming launches...</div>
			</div>

			<div v-else-if="error" class="text-center pa-4">
				<v-icon icon="mdi-alert-circle" color="error" size="32" />
				<div class="mt-2 text-error">Error loading countdown</div>
			</div>

			<div v-else-if="nextLaunch" class="text-center">
				<div class="text-h6 mb-2">{{ nextLaunch.mission_name }}</div>
				<div class="text-body-2 mb-4">
					{{ formatDate(nextLaunch.launch_date_local) }}
				</div>

				<div v-if="timeRemaining.total > 0" class="countdown-grid">
					<div class="countdown-item">
						<div class="countdown-number">{{ timeRemaining.days }}</div>
						<div class="countdown-label">Days</div>
					</div>
					<div class="countdown-item">
						<div class="countdown-number">{{ timeRemaining.hours }}</div>
						<div class="countdown-label">Hours</div>
					</div>
					<div class="countdown-item">
						<div class="countdown-number">{{ timeRemaining.minutes }}</div>
						<div class="countdown-label">Minutes</div>
					</div>
					<div class="countdown-item">
						<div class="countdown-number">{{ timeRemaining.seconds }}</div>
						<div class="countdown-label">Seconds</div>
					</div>
				</div>

				<div v-else class="text-h6 text-success">
					<v-icon icon="mdi-rocket-launch" class="me-2" />
					Launching Now!
				</div>
			</div>

			<div v-else class="text-center pa-4">
				<v-icon icon="mdi-calendar-blank" color="grey" size="32" />
				<div class="mt-2 text-grey">No upcoming launches scheduled</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
const query = gql`
	query getUpcomingLaunches {
		launchesUpcoming(limit: 100) {
			id
			mission_name
			launch_date_local
		}
	}
`

const { data, pending, error } = useAsyncQuery<{
	launches: {
		id: string
		mission_name: string
		launch_date_local: string
	}[]
}>(query)

const nextLaunch = computed(() => {
	const now = new Date()
	const upcomingLaunches = data.value?.launches?.filter(launch => 
		new Date(launch.launch_date_local) > now
	) || []
	return upcomingLaunches[0]
})

const timeRemaining = ref({
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
	total: 0
})

const updateCountdown = () => {
	if (!nextLaunch.value) return

	const now = new Date()
	const launchDate = new Date(nextLaunch.value.launch_date_local)
	const diff = launchDate.getTime() - now.getTime()

	if (diff > 0) {
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
		const seconds = Math.floor((diff % (1000 * 60)) / 1000)

		timeRemaining.value = {
			days,
			hours,
			minutes,
			seconds,
			total: diff
		}
	} else {
		timeRemaining.value = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			total: 0
		}
	}
}

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

// Update countdown every second
onMounted(() => {
	updateCountdown()
	const interval = setInterval(updateCountdown, 1000)
	
	onUnmounted(() => {
		clearInterval(interval)
	})
})

// Watch for changes in nextLaunch
watch(nextLaunch, () => {
	updateCountdown()
})
</script>

<style scoped>
.countdown-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1rem;
	margin: 1rem 0;
}

.countdown-item {
	text-align: center;
	padding: 1rem;
	background: linear-gradient(135deg, #1976d2, #42a5f5);
	color: white;
	border-radius: 8px;
}

.countdown-number {
	font-size: 1.5rem;
	font-weight: bold;
	line-height: 1;
}

.countdown-label {
	font-size: 0.75rem;
	opacity: 0.9;
	margin-top: 0.25rem;
}
</style> 