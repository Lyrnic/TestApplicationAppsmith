export default {
  async Data_Search() {
    // await getJobs.run();
    await getUser.run();

    //const JobData = getJobs.data || [];
		await getTenants.run()
		let tenantPrefixes= getTenants.data.map(x=>x.tenantPrefix+"_")
		let JobData=[]
		for(let i=0;i < tenantPrefixes.length;i++){
     	await getJobsAllTenant.run({prefix:tenantPrefixes[i]})
			JobData.push(...getJobsAllTenant.data)
     }
    const UserData = getUser.data || [];

    // If no user data, return all jobs
    if (UserData.length === 0) {
      return { jobs: JobData, user: null };
    }

    const user = UserData[0]; // Assume first (and only) user

    // Safely extract applied job IDs
    const appliedJobIds = new Set(
      (user.applied_job || []).map(app => String(app.jobPostingID))
    );

    // Filter out jobs where _id is in appliedJobIds
    const filteredJobs = JobData.filter(job => {
      const jobId = String(job._id);
      return !appliedJobIds.has(jobId);
    });

    return {
      jobs: filteredJobs,
      user: [user]
    };
  }
};