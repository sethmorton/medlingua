<script>
	// imports
	import { onMount, afterUpdate } from 'svelte';
    import PatientList from '$lib/components/PatientList.svelte';
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
	let userPortal = false;

	// page loaded boolean
	let pageLoaded = false;

    // user id

    /**
     * @type {number}
     */
    let patientID;

	// lifecycle

	afterUpdate(() => {
		if (pageLoaded) {
			if (doctorPortal) {
				scrollToElement('doctor');
			} else if (userPortal) {
				scrollToElement('user');
			}
		}
	});

	onMount(async () => {
		pageLoaded = true;
		await import('apexcharts').then((ApexCharts) => {
			apexcharts = ApexCharts;
		});
		createFileDrop('file-drop');
	});

	const createFileDrop = (/** @type {string} */ fileDropID) => {
		// Add JavaScript to handle file upload
		const fileDrop = document.getElementById(fileDropID);

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
				fileDrop.classList.remove('border-blue-600');
				const file = e.dataTransfer.files[0];
				handleFileUpload(file, fileDrop);
			});
			fileDrop.addEventListener('change', (e) => {
				const file = e.target.files[0];
				handleFileUpload(file, fileDrop);
			});
		}
	};

	// functions
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

		inputtedFiles = [...inputtedFiles, file];
		// Add your file handling logic here
	};

	const deleteFile = (/** @type {File} */ file) => {
		if (inputtedFiles.length > 0) {
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
				userPortal = true;
			}
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
		createPatientPortal();
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
			{#if !(doctorPortal || userPortal)}
				<button
					class="flex items-center justify-center bg-blue-500 hover:bg-blue-800 text-white px-6 font-bold text-xl md:text-3xl py-3 rounded-full transition duration-300 transform hover:scale-105"
					on:click={() => (loginPopup = true)}
				>
					<span class="p-0">Login</span>
				</button>
			{:else}
				<div class="flex items-center justify-center text-2xl text-white">
					<h1>
						Hi, {#if userPortal} User! {:else} Doctor! {/if}
					</h1>
				</div>
				<button
					class="flex ml-5 items-center justify-center bg-gray-500 hover:bg-blue-800 text-white px-4 font-bold text-xl md:text-xl py-3 rounded-full transition duration-300 transform hover:scale-105"
					on:click={() => ((userPortal = false), (doctorPortal = false), (loginPopup = true))}
				>
					<span class="p-0">Sign Out</span>
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
		id="doctor_portal"
		class="min-h-screen bg-gradient-to-b from-pink-400 to-red-500 flex items-center justify-center"
	>
		<div class="flex flex-col justify-around gap-y-10">
			<div class="flex flex-col gap-y-5 items-center">
				<label for="patient-id" class="block mt-5 text-xl text-white">Patient ID:</label>
				<input
					type="text"
					id="patient-id"
                    bind:value={patientID}
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
				<div id="uploaded_doctors_notes" class={isFileHidden}>
					<p class="font-bold mt-5">Uploaded Files:</p>

					<ul
						class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						{#each inputtedFiles as file}
							<li
								class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
							>
								{file.name}
								<button on:click={() => deleteFile(file)}
									><i class="pl-2 fa-solid fa-trash" /></button
								>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if userPortal}
<div id="user_portal" class="min-h-screen bg-gradient-to-b from-blue-400 to-indigo-500 flex flex-col items-center justify-center">
    <h1 class="text-white text-5xl mb-10">Patient Portal</h1>
    <div class="flex">
        <ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">Profile</li>
            <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Settings</li>
            <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Messages</li>
            <li class="w-full px-4 py-2 rounded-b-lg">Download</li>
        </ul>
        <div class="flex flex-col justify-center gap-y-10">
            <PatientList />
          </div>
    </div>
    <div class="flex flex-row justify-start gap-x-10">
      <!-- Left Column (Patient List) -->
      <div class="flex flex-col justify-center gap-y-10">
        <PatientList />
      </div>
  
      <!-- Right Column (Chart or other content) -->
      <div class="flex flex-col justify-center gap-y-10">
        <!-- Add your chart or other content here -->
      </div>
    </div>
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
