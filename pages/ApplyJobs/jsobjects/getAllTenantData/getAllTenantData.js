export default {
	allTenantJobs: [],
	myVar2: {},

	async allJobsJS () {
		await getTenants.run()
		let tenantPrefixes= getTenants.data.map(x=>x.tenantPrefix+"_")
		let allJobs=[]
		for(let i=0;i < tenantPrefixes.length;i++){
     	await getJobsAllTenant.run({prefix:tenantPrefixes[i]})
			allJobs.push(...getJobsAllTenant.data)
     }
		this.allTenantJobs=allJobs
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}