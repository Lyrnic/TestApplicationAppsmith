export default {
	myVar1: [],
	myVar2: {},
	navRun () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},
	async candidateCheck () {
		
	getInterviewId.run().then(() => {
  const candidateId = getInterviewId.data[0]._id;
  const tenant_id = getTenants.data.filter(data=>
		data.tenantPrefix==Custom4.model.tenantPrefix
	)[0]._id

  // Combine candidateId and tenant_id
  const combined = `${candidateId}:${tenant_id}`;

  // Encode to Base64 (standard)
  const encoded = btoa(combined);

  // Build the final URL with encoded interviewReference
  const interviewReference = encoded;
  const url = `https://aiinterviewer.safal.io/?interviewReference=${interviewReference}`;

  // Open in new window
  navigateTo(url, {}, 'NEW_WINDOW');
}).catch(() => {
  showAlert('You are not shortlisted.', 'info');
});

	}
}