document.getElementById("upload-input").addEventListener('change', function() {
	const file = this.files[0];
	processFile(file);
});

document.getElementById("record").addEventListener('click', function() {
	let recording = document.getElementById("recording");
	var recordingTimeMS = 5000;

	navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {

		const mediaRecorder = new MediaRecorder(stream);
		console.log(mediaRecorder.mimeType);
		mediaRecorder.start();
		const audioChunks = [];

		mediaRecorder.addEventListener("dataavailable", event => {
		  audioChunks.push(event.data);
		});

		mediaRecorder.addEventListener("stop", () => {
			const audioBlob = new Blob(audioChunks);
			
			audioBlob.getProperties().setContentType(mediaRecorder.mimeType);
			processFile(audioBlob);
		});

		setTimeout(() => { mediaRecorder.stop(); }, recordingTimeMS);
	});
	

});

function predict(signals) {
	//will be implemented later on
	return 1;
}

function processSignals(signals) {
	prediction = predict(signals);
	console.log(prediction);

	var display;
	if (prediction <= 0) {
		display = "No COVID-19 Symptoms Detected";
	} else {
		display = "COVID-19 Dry Cough Detected";
	}
	document.getElementById("diagnosis").innerHTML = display;
	document.getElementById("diagnosis").style.visibility = "visible";
}

function processFile(file) {
	const fileURL = URL.createObjectURL(file);

	let preview = document.getElementById("preview");
	preview.src = fileURL;

	var reader = new FileReader();
	reader.readAsArrayBuffer(file);
	
	reader.onloadend = function (evt) {
		if (evt.target.readyState == FileReader.DONE) {
			var arrayBuffer = evt.target.result;
			typedArray = new Int8Array(arrayBuffer);
			var signals = Array.from(typedArray);

			console.log(signals);

			processSignals(signals);
		}
	}
}

