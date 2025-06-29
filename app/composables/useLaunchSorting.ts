export const useLaunchSorting = () => {
	const sortOrder = ref<'asc' | 'desc'>('desc')

	const sortLaunchesByDate = (launches: any[], order: 'asc' | 'desc') => {
		return [...launches].sort((a, b) => {
			const dateA = new Date(a.launch_date_local).getTime()
			const dateB = new Date(b.launch_date_local).getTime()
			
			if (order === 'asc') {
				return dateA - dateB
			} else {
				return dateB - dateA
			}
		})
	}

	return {
		sortOrder: readonly(sortOrder),
		sortLaunchesByDate,
		setSortOrder: (order: 'asc' | 'desc') => sortOrder.value = order
	}
} 