export default defineNuxtRouteMiddleware((to) => {
	// If the route doesn't exist, redirect to launches page
	if (to.name === '404' || to.name === 'error') {
		return navigateTo('/launches')
	}
}) 