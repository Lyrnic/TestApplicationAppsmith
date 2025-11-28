export default {
	custom: {},
	myVar2: {},
	submitProfileJS () {
		let customData=this.custom
		console.log("customData",customData)
		
showModal("Modal2")

updateCandidate.run()
  .then(() => {
showAlert("saved", "success")
console.log(Custom6.model.resumeFile, "hi3")
	
    if (Custom6.model.resumeFile != "") {
showAlert("saved2", "success")
      return parseResume.run(
				{customData: customData}).then(()  =>{ 
 uploadResume.run()
getCandidate.run()
   closeModal("Modal2")
    showAlert("Profile Updated!", "success");});

    } else {
      console.log("No resume file to parse or upload");
    }
  })
  .catch(() => {
    // Handle error here if needed
  })
  .finally(() => {
		//getCandidate.run()
   //closeModal("Modal2")
    //showAlert("Profile Updated!", "success");
  });
	},
	async test () {
		
showModal("Modal2")

updateCandidate.run()
  .then(() => {
showAlert("saved", "success")
console.log(Custom6.model.resumeFile, "hi3")
	
    if (Custom6.model.resumeFile != "") {
showAlert("saved2", "success")
      return parseResume.run(
				{resumeFile: Custom6.model.resumeFile}).then(()  =>{ 
 uploadResume.run()
getCandidate.run()
   closeModal("Modal2")
    showAlert("Profile Updated!", "success");});

    } else {
      console.log("No resume file to parse or upload");
    }
  })
  .catch(() => {
    // Handle error here if needed
  })
  .finally(() => {
		//getCandidate.run()
   //closeModal("Modal2")
    //showAlert("Profile Updated!", "success");
  });
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}