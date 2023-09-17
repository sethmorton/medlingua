<script>
	// imports
	import { onMount, afterUpdate, tick } from 'svelte';
	import UserPortal from '$lib/components/UserPortal.svelte';
	// image imports
	import heroIMG from '$lib/images/hero_logo.png';
	import logo from '$lib/images/logo.png';
	import Patient from '$lib/helpers/User';

	const PATH = 'http://10.189.95.23:8000/upload/notes';

	// global variables

	/**
	 * @type {File[]}
	 */
	let inputtedFiles = [];

    $: console.log(inputtedFiles);

	/**
	 * @type {typeof import('apexcharts').default}
	 */
	let apexcharts;

	let isFileHidden = '';
	$: if (inputtedFiles.length > 0) {
		isFileHidden = 'block';
	} else {
		isFileHidden = 'hidden';
	}
	// login popup modal
	let loginPopup = false;
	// login modal class
	let isModalHidden = '';
	$: isModalHidden = loginPopup ? 'block' : 'hidden';

	// portal booleans
	let doctorPortal = false;
	let doctorDashboard = false;
	let patientPortal = false;

    $: if (!(doctorPortal && patientPortal)) {
        inputtedFiles = [];
    }

	// page loaded boolean
	let pageLoaded = false;

	// patient id

	/**
	 * @type {number}
	 */
	let patientID;

	let name = '';

	// lifecycle

	afterUpdate(() => {
		if (pageLoaded) {
			if (doctorPortal) {
				scrollToElement('doctor');
                createFileDrop('file-drop');
			} else if (patientPortal) {
				scrollToElement('user');
			}
		}
	});

	onMount(async () => {
		pageLoaded = true;
		await import('apexcharts').then((ApexCharts) => {
			apexcharts = ApexCharts;
		});
	});

	// functions

	const createFileDrop = (/** @type {string} */ fileDropID) => {
		// Add JavaScript to handle file upload
		const fileDrop = document.getElementById(fileDropID);

        // console.log(fileDrop);

		if (fileDrop !== null) {
			fileDrop.addEventListener('dragover', (e) => {
				e.preventDefault();
				fileDrop.classList.add('border-blue-600');
			});

			fileDrop.addEventListener('dragleave', () => {
				fileDrop.classList.remove('border-blue-600');
			});

			fileDrop.addEventListener('drop', (e) => {
                e.preventDefault();

                console.log("SUBMMITINGD ASLDSALK LSK");
				fileDrop.classList.remove('border-blue-600');
				const file = e.dataTransfer.files[0];
                if (file.type !== 'application/pdf') {
                    alert('Please upload a PDF file!');
                    return;
                }
                if (inputtedFiles.includes(file)) {
                    alert('You have already uploaded this file!');
                }
                else {
                    handleFileUpload(file, fileDrop);
                }
				
			});
		}
	};

	/**
	 *
	 * @param file
	 * @param metadata
	 * @returns {FormData}
	 */
	const createNotesBody = (
		/** @type {File} */ file,
		/** @type {Record<string, string>} */ metadata
	) => {
		const notesBody = new FormData();
		notesBody.append('file', file);
		notesBody.append('metadata', JSON.stringify(metadata));

		return notesBody;
	};
	const postNotes = async (
		/** @type {File} */ file,
		/** @type {Record<string, string>} */ metadata
	) => {
		const notesBody = createNotesBody(file, metadata);

		const response = await fetch(PATH, {
			method: 'POST',
			body: notesBody
		});

		try {
			if (response.ok) {
				const responseData = await response.json();
				console.log(responseData);
			}
		} catch (error) {}

		console.log(await response.json());
	};
	/**
	 *
	 * @param files
	 * @param element
	 */
	const handleFileUpload = (/** @type {File} */ file, /** @type {HTMLElement} */ element) => {
		// we can change all these class adds / inner html changes
		// element.classList.add('bg-gray-600');
		// element.innerHTML = '<h1 class="text-white">Uploaded</h1>';
		console.log('Uploaded file:', file);

        // create a set from the inputted files
        const inputtedFileNames = inputtedFiles.map((f) => f.name);
        const fileNamesSet = new Set(inputtedFileNames);

        // if the file is already in the set, don't add it
        if (fileNamesSet.has(file.name)) {
            alert('You have already uploaded this file!');
            return;
        }
        else {
            inputtedFiles = [...inputtedFiles, file];
        }
        

		
		// Add your file handling logic here
	};

	const onDoctorFileSubmit = () => {
		createDoctorPortal();
		// this is just a test
		doctorDashboard = true;
	};

	const deleteFile = (/** @type {File} */ file) => {
        if (inputtedFiles.length == 1) {
            inputtedFiles = [];
        }
		if (inputtedFiles.length > 1) {
			inputtedFiles = inputtedFiles.filter((f) => f.name !== file.name);
		}
	};

	const onFormSubmit = (/** @type {{ target: HTMLFormElement | undefined; } | null} */ e) => {
		/**
		 * @type {Record<string, FormDataEntryValue>}
		 */
		let formData = {};
		if (e !== null) {
			const formSubmissionData = new FormData(e.target);
			formSubmissionData.forEach((value, key) => {
				console.log(formData);
				console.log(key, value);
				formData[key] = value;
			});
			// this would be the validation

			loginPopup = false;
			if (formData['account_type'] === 'doctor') {
				doctorPortal = true;
			} else {
				patientPortal = true;
			}
			name = formData['name'].toString();
		}
	};

	/**
	 *
	 * @param element
	 */
	const scrollToElement = (/** @type {FormDataEntryValue} */ element) => {
		console.log(`${element}_portal`);
		let targetElement = document.getElementById(`${element}_portal`);
		console.log(targetElement);
		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start' // 'start', 'center', 'end', or 'nearest'
			});
		}
		if (element === 'user') {
			createPatientPortal();
		}
	};

	const createPatientPortal = () => {
		// this is just a test
		let patient = new Patient(patientID);
		if (pageLoaded) {
			const { chartID, options } = patient.createLineChart();
			createChart(chartID, options);
		}
	};

	const createDoctorPortal = () => {
		// this is just a test
		let patient = new Patient(patientID);
		if (pageLoaded) {
			const { chartID, options } = patient.createLineChart();
			createChart(chartID, options);
		}
	};

	/**
	 *
	 * @param chartID
	 * @param options
	 */
	const createChart = (
		/** @type {string} */ chartID,
		/** @type {{ chart: { type: string; }; series: { name: string; data: number[]; }[]; xaxis: { categories: number[]; }; }} */ options
	) => {
		if (pageLoaded) {
			const chart = document.getElementById(chartID);
			let myChart = new apexcharts.default(chart, options);
			myChart.render();

			return {
				update(options) {
					myChart.updateOptions(options);
				},
				destroy() {
					myChart.destroy();
				}
			};
		}
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
		integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>
<!-- bg-gradient-to-r from-red-500 to-indigo-600 -->
<div class="flex flex-col min-h-screen bg-gradient-to-r from-[#155AE6] to-[#8BBBE7]">
	<!-- Navbar Section -->

	<div class="flex justify-between p-10 bg-transparent w-full z-10 top-0 fixed">
		<div class="flex items-center">
			<img src={logo} alt="" class="w-20" />
			<h1 class="text-white font-bold text-5xl">MedLingua</h1>
		</div>
		<div class="hidden md:flex items-center">
			{#if !(doctorPortal || patientPortal)}
				<button
					class="flex items-center justify-center bg-blue-500 hover:bg-blue-800 text-white px-6 font-bold text-xl md:text-3xl py-3 rounded-full transition duration-300 transform hover:scale-105"
					on:click={() => (loginPopup = true)}
				>
					<span class="p-0">Login</span>
				</button>
			{:else}
				<div class="flex items-center justify-center text-2xl text-white">
					<h1>
						Hi, {name}!
					</h1>
				</div>
				<button
					class="flex ml-5 items-center justify-center bg-gray-500 hover:bg-blue-800 text-white px-4 font-bold text-xl md:text-xl py-3 rounded-full transition duration-300 transform hover:scale-105"
					on:click={() => ((patientPortal = false), (doctorPortal = false), (loginPopup = true))}
				>
					<span class="p-0 text-white">Sign Out</span>
				</button>
			{/if}
		</div>
	</div>

	<div class="flex-grow flex flex-col-reverse md:flex-row items-center justify-between ml-20">
		<div class="max-w-2xl text-center md:text-left ml-10">
			<h1 class="text-4xl md:text-6xl font-bold mb-4 text-white">Unified Insights</h1>
			<p class="text-lg md:text-xl mb-8 text-white">Endless possibilities for healthier lives.</p>
			<div class="flex justify-center md:justify-start mb-4">
				<a
					href="#"
					class="mr-4 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white py-2 px-6 rounded-full transition duration-300 ease-in-out"
					>Get Started</a
				>
				<a
					href="#"
					class="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-600 py-2 px-6 rounded-full transition duration-300 ease-in-out"
					>Learn More</a
				>
			</div>
		</div>

		<div class="max-w-3xl pt-20 mr-15 pr-5 md:pt-0">
			<img src={heroIMG} alt="" class="float-right pr-5" />
		</div>
	</div>
</div>
<div
	id="defaultModal"
	tabindex="-1"
	aria-hidden="true"
	class="fixed min-h-screen z-50 {isModalHidden} w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
>
	<div class="relative w-full max-h-full min-h-screen">
		<section class="bg-gray-50 dark:bg-gray-900 {isModalHidden}">
			<div class="fixed top-0 w-full">
				<div class="flex justify-between w-full p-6">
					<a
						href="#"
						class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
					>
						<img class="w-8 h-8 mr-2" src={logo} alt="logo" />
						MedLingua
					</a>
					<button
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-5 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-hide="defaultModal"
						on:click={() => (loginPopup = false)}
					>
						<svg
							class="w-5 h-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
							/>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
			</div>

			<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div
					class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
				>
					<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1
							class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center"
						>
							Sign in to your account
						</h1>
						<form class="space-y-4 md:space-y-6" action="#" on:submit|preventDefault={onFormSubmit}>
							<div class="">
								<label
									for="account_type"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
									>Select account type</label
								>
								<select
									id="account_type"
									name="account_type"
									class="text-center bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								>
									<option value="doctor">Doctor</option>
									<option value="user">User</option>
								</select>
							</div>
							<div>
								<label
									for="name"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label
								>
								<input
									type="name"
									name="name"
									id="name"
									class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="John Doe"
									required
								/>
							</div>
							<div>
								<label
									for="email"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>Your email</label
								>
								<input
									type="email"
									name="email"
									id="email"
									class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@company.com"
									required
								/>
							</div>
							<div>
								<label
									for="password"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>Password</label
								>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-start">
									<div class="flex items-center h-5">
										<input
											id="remember"
											aria-describedby="remember"
											type="checkbox"
											class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
										/>
									</div>
									<div class="ml-3 text-sm">
										<label for="remember" class="text-gray-500 dark:text-gray-300"
											>Remember me</label
										>
									</div>
								</div>
								<a
									href="#"
									class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
									>Forgot password?</a
								>
							</div>
							<button
								type="submit"
								class="w-full text-white bg-black hover:bg-white text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white dark:focus:ring-primary-800 text-xl"
								>Sign in</button
							>
							<p class="text-sm font-light text-gray-500 dark:text-gray-400">
								Don’t have an account yet? <a
									href="#"
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>Sign up</a
								>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

{#if doctorPortal}
	<div
	>
		{#if !doctorDashboard}
        <div
		id="doctor_portal"
		class="min-h-screen bg-gradient-to-b from-[#43cea2] to-[#185a9d] flex items-center justify-center"
	>
			<div class="flex flex-col justify-around gap-y-10">
				<div class="flex flex-col gap-y-5 items-center">
					<label for="patient-id" class="block mt-5 text-xl text-white">Patient ID:</label>
					<input
						type="text"
						id="patient-id"
						bind:value={patientID}
						placeholder="123456789"
						class="w-full border bg-white border-gray-300 rounded-lg px-3 py-2"
					/>
				</div>
				<h1 class="text-white font-bold text-5xl">Patient File Upload</h1>
				<div class="bg-white p-10 rounded-lg shadow-lg">
					<label for="file-upload" class="block text-xl mb-4 text-center"
						>Drag and Drop Your Medical Notes</label
					>
					<input type="file" id="file-upload" class="hidden" />
					<div
						id="file-drop"
						class="w-full h-32 border-2 border-white-400 flex items-center justify-center"
					>
						<p class="text-gray-600">Drop your file here</p>
					</div>
					<div id="uploaded_doctors_notes" class="flex justify-center flex-col {isFileHidden}">
						<p class="font-bold mt-5 text-gray-900">Uploaded Files:</p>

						<ul
							class="mt-3 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						>
							{#each inputtedFiles as file}
                            <div class="flex justify-between w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                {file.name}
                                <button on:click={() => deleteFile(file)}
                                    ><i class="pl-2 fa-solid fa-trash" /></button
                                >
                            </div>

							{/each}
						</ul>
						<button on:click={() => onDoctorFileSubmit()} class="mt-3 rounded-lg bg-blue-800 text-white px-6 py-3 text-center"
							>Submit</button
						>
					</div>
				</div>
			</div>
            </div>
            {:else}
            <div class="flex flex-row min-h-screen bg-gradient-to-b from-[#43cea2] to-[#185a9d]">
                <!-- Left side with graphs -->
                <div class="w-1/2 flex flex-col justify-center">
                  <!-- Graph 1 -->
                  <div class="bg-white p-4 mb-4 rounded-lg shadow">
                    <!-- Replace with your graph 1 image -->
                    <img src="graph1.png" alt="Graph 1" class="w-full h-auto" />
                  </div>
                  <!-- Graph 2 -->
                  <div class="bg-white p-4 mb-4 rounded shadow">
                    <!-- Replace with your graph 2 image -->
                    <img src="graph2.png" alt="Graph 2" class="w-full h-auto" />
                  </div>
                  <!-- Graph 3 -->
                  <div class="bg-white p-4 mb-4 rounded shadow">
                    <!-- Replace with your graph 3 image -->
                    <img src="graph3.png" alt="Graph 3" class="w-full h-auto" />
                  </div>
                </div>
              
                <!-- Right side with text -->
                <div class="w-1/2 flex flex-col justify-center p-6">
                  <div class="flex">
                    <h1 class="text-white text-2xl font-bold">Patient Dashboard</h1>
                  </div>
                  <div class="text-white mt-4">
                    <!-- Insert your bunch of text here -->
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et turpis vel tellus porta tristique. Quisque
                    vitae fermentum dolor. Donec eget ligula vel justo tempus pretium. Nunc ut convallis purus, nec tristique
                    felis. ...
                  </div>
                </div>
              </div>
		{/if}
	</div>
{/if}
{#if patientPortal}
	<div
		id="user_portal"
		class="min-h-screen flex flex-col bg-gradient-to-b from-[#EB96FC] to-[#8C77E9]"
	>
		<UserPortal />
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	a,
	li,
	ul,
	ol,
	button,
	input,
	textarea,
	label,
	div,
	span {
		font-family: 'Lato', sans-serif;
	}
</style>
