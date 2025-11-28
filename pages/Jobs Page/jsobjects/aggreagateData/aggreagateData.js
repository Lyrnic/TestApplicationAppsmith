export default {
  myVar1: [],
	interviewDataAll:[],
	dataLoaded:false,
  myVar2: {},

 async getCandidateId() {
    await getCandidate.run();
    const data = getCandidate.data;
    return data?.[0]?._id || null;
  },

  async data_search() {
		showModal("Modal2")
	 	
	 await getCandidate.run();
    const candidate = getCandidate.data?.[0] || null;
		await getTenants.run()
		let tenantPrefixes= getTenants.data.map(x=>x.tenantPrefix+"_")
		let jobPostings=[]
		let interviewData=[]
		for(let i=0;i < tenantPrefixes.length;i++){
			await getInterview.run({prefix:tenantPrefixes[i]})
     	await getJobPostings.run({prefix:tenantPrefixes[i]})
			jobPostings.push(...getJobPostings.data)
			interviewData.push(...getInterview.data)
     }
		this.interviewDataAll=interviewData
		
    //const jobPostings = Array.isArray(getJobPostings.data) ? getJobPostings.data : [];

    if (!candidate) {
			navigateTo("Profile");
      return {
        applications: [],
        totalApplications: 0,
        interviewsScheduled: 0,
        completed: 0,
        averageScore: '0',
        nextInterview: null,
        pipeline: ["Application", "Qualification", "AI Interview", "Shortlisting", "Final Interview", "Offer"],
        currentStageIndex: 0,
        _id: null,
        name: null
      };
    }

    // Map applied_job objects
    const appliedJobs = Array.isArray(candidate.applied_job)
      ? candidate.applied_job.filter(item => item?.jobPostingID)
      : [];

    // Build job map for quick lookup
    const jobMap = {};
    jobPostings.forEach(job => {
      if (job && !job.deleted && job._id) {
        jobMap[job._id] = job;
      }
    });

    // Build enriched applications list
    const applications = appliedJobs
      .map(({ jobPostingID, interviewID }) => {
        const job = jobMap[jobPostingID];
        if (!job) return null;

        // Find candidate record inside the job
        const applicationRecord = Array.isArray(job.candidates)
          ? job.candidates.find(c => c?.id === candidate._id) || {}
          : {};

        // Determine status
        let status = applicationRecord.status || "Applied";
        let statusClass = "status-applied";

        if (status.toLowerCase() === "in-progress") {
          status = "Interview Scheduled";
          statusClass = "status-scheduled";
        } else if (status.toLowerCase() === "application") {
          status = "Applied";
          statusClass = "status-applied";
        } else if (status.toLowerCase() === "shortlisted" || job.boardId === "3") {
          status = "Shortlisted";
          statusClass = "status-shortlisted";
        }else if (status.toLowerCase() === "rejected" || job.boardId === "3") {
          status = "Rejected";
          statusClass = "status-rejected";
        }

        // Interview details (per candidate)
        let interviewDate = "Not scheduled";
        let interviewTime = "";
        let interviewStatus = "Not Scheduled";
        let score = candidate.scoring?.overallScore ? `${candidate.scoring.overallScore}%` : null;

        if (candidate.meeting?.start?.dateTime) {
          const date = new Date(candidate.meeting.start.dateTime);
          if (!isNaN(date.getTime())) {
            interviewDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            interviewTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            interviewStatus = candidate.completed ? "Completed" : "Pending";
          }
        }
console.log(applicationRecord,"job")
        return {
          jobId: job._id,
          interviewId: interviewID || "",
          title: job.title || "Untitled Job",
          company: job.client || "Hiring Company",
          status,
          statusClass,
          location: job.location || "Not specified",
          appliedDate: applicationRecord.appliedDate,
					instantInterview: job.instantInterview || false,
          interview: {
            type: "AI Interview",
            date: interviewDate,
            time: interviewTime,
            duration: "60 min",
            status: interviewStatus,
            score
          }
        };
      })
      .filter(Boolean);

    // Stats
    const totalApplications = applications.length;
    const interviewsScheduled = applications.filter(app => app.interview.status === "Pending").length;
    const completed = applications.filter(app => app.interview.status === "Completed").length;

    const scores = applications
      .map(app => app.interview.score)
      .filter(Boolean)
      .map(score => parseInt(score, 10) || 0);

    const averageScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + '%'
      : totalApplications > 0 ? 'N/A' : '0';

    // Next interview (simplified)
    let nextInterview = null;
    if (candidate.meeting?.start?.dateTime && !candidate.completed) {
      const appsWithInterview = applications.filter(app => app.interview.status === "Pending");
      if (appsWithInterview.length) {
        const next = appsWithInterview[0];
        nextInterview = { ...next.interview, jobTitle: next.title, company: next.company };
      }
    }

    const pipeline = ["Application", "Qualification", "AI Interview", "Shortlisting", "Final Interview", "Offer"];

    // Current stage
    let currentStageIndex = 0;
    if (candidate.completed) currentStageIndex = 5;
    else if (candidate.meeting?.start?.dateTime) currentStageIndex = 4;
    else if (applications.some(app => app.status === "Interview Scheduled")) currentStageIndex = 2;
    this.dataLoaded=true
		closeModal("Modal2")
    return {
      ...candidate,
      applications,
      totalApplications,
      interviewsScheduled,
      completed,
      averageScore,
      nextInterview,
      pipeline,
      currentStageIndex
    };
  }
}
