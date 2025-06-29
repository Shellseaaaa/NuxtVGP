import { ref, readonly } from 'vue'

export const useLaunchFilters = () => {
	const selectedYear = ref<string>('all')
	const availableYears = ref<string[]>([])

	const filterLaunchesByYear = (launches: any[], year: string) => {
		if (year === 'all') return launches
		return launches.filter(launch => {
			const launchYear = new Date(launch.launch_date_local).getFullYear().toString()
			return launchYear === year
		})
	}

	const extractYearsFromLaunches = (launches: any[]) => {
		const years: string[] = []
		launches.forEach(launch => {
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
	}

	return {
		selectedYear: readonly(selectedYear),
		availableYears: readonly(availableYears),
		filterLaunchesByYear,
		extractYearsFromLaunches,
		setSelectedYear: (year: string) => selectedYear.value = year,
		setAvailableYears: (years: string[]) => availableYears.value = years
	}
} 