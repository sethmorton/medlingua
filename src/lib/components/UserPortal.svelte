<!-- MedicalDataList.svelte -->

<script>
	const medicalData = [
		{ id: 1, date: '2023-09-10', pdfLink: 'path/to/pdf1.pdf' },
		{ id: 2, date: '2023-08-25', pdfLink: 'path/to/pdf2.pdf' }
		// Add more medical data
	];

	/**
	 * @type {number}
	 */
	let selectedID = 0;

    let pdfSelectToggle = false;


    let pdfText = 'No PDF selected yet!';
    let aiText = 'No summary...';


	const viewPdf = (/** @type {string} */ pdfLink, /** @type {number} */ id) => {
		selectedID = id;
		// Logic to view the PDF and its summarized version
		// Replace this with your logic to view the PDF
		console.log('View PDF for:', pdfLink);
        pdfText = `This is the PDF text for ${pdfLink}}`;
        aiText = `This is the AI text for ${pdfLink}}`;
        pdfSelectToggle = true;
	};
</script>


	<div class="mb-20" />
    {#if pdfSelectToggle}
	<div class="flex flex-grow justify-around mt-20">
		<!-- <div class="flex-none basis-[20%] p-6">
			<div class="flex flex-col justify-between items-center">
				<div
					class="bg-white dark:bg-gray-800 dark:border-gray-700 h-full w-full rounded-lg px-6 py-3 text-center"
				>

					<h1 class="text-white text-xl pb-3 pt-3">Select a note</h1>
					<div
						class="py-4 flex flex-col items-center justify-center w-full font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						{#each medicalData as { id, date, pdfLink }}
							<button
								type="button"
								on:click={() => viewPdf(pdfLink, id)}
								class="py-2.5 px-5 mb-3 ext-sm font-medium dark:text-white focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
								class:active={selectedID === id}>{date}</button
							>
						{/each}
					</div>
				</div>
			</div>
		</div> -->

        <div class="flex-1 basis-[50%]  ml-10 p-6 h-auto">
            <div class="h-full w-full bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 flex">
                <p class="font-normal text-gray-700 dark:text-white m-5">{pdfText}</p>
            </div>
        </div>
        
        <div class="flex-1 basis-[50%] p-6 h-auto mr-10">
            <div class="h-full w-full bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 flex">
                <p class="font-normal text-gray-700 dark:text-white m-5">{aiText}</p>
            </div>
        </div>
	</div>
    <div class="flex items-center justify-center w-full p-5 mb-10">
        <button class="bg-white text-black dark:bg-gray-800 rounded-lg px-6 py-2 hover:bg-black hover:text-white dark:text-white text-2xl dark:hover:bg-white dark:hover:text-blue-700" on:click={() => pdfSelectToggle = false}>Go Back</button>
    </div>
    {:else}
    <div class="flex flex-grow h-full justify-center items-center">
        <div class="flex flex-col justify-between items-center">
            <div
                class="bg-white dark:bg-gray-800 dark:border-gray-700 h-full w-full rounded-lg px-6 py-3 text-center"
            >

                <h1 class="text-white text-3xl pb-3 pt-3">Select a medical record:</h1>
                <div
                    class="py-4 flex flex-col items-center justify-center w-full font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    {#each medicalData as { id, date, pdfLink }}
                        <button
                            type="button"
                            on:click={() => viewPdf(pdfLink, id)}
                            class="py-2.5 px-5 mb-3 text-lg font-medium dark:text-white focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">{date}</button
                        >
                    {/each}
                </div>
            </div>
        </div>
    </div>
    {/if}


<style>
	@media (prefers-color-scheme: light) {
		.active {
			background-color: white;
			color: black;
		}
	}
	@media (prefers-color-scheme: dark) {
		.active {
			background-color: white;
			color: black;
		}
	}
</style>
