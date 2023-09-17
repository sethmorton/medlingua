<!-- MedicalDataList.svelte -->

<script>
    let medicalData = [
      { id: 1, date: '2023-09-10', pdfLink: 'path/to/pdf1.pdf' },
      { id: 2, date: '2023-08-25', pdfLink: 'path/to/pdf2.pdf' },
      // Add more medical data
    ];
  
    const viewPdf = (pdfLink) => {
      // Logic to view the PDF and its summarized version
      // Replace this with your logic to view the PDF
      console.log('View PDF for:', pdfLink);
    };
  </script>
  
  <style>
    /* Add your Tailwind CSS classes or custom styles here */
    ul {
      list-style: none;
      padding: 0;
    }
  
    li {
      cursor: pointer;
      padding: 8px;
      border: 1px solid #ccc;
      margin-bottom: 4px;
      transition: background-color 0.3s ease;
  
      &:hover {
        background-color: #f0f0f0;
      }
    }
  </style>
  
  <ul>
    {#each medicalData as item (item.id)}
      <li key={item.id} on:click={() => viewPdf(item.pdfLink)}>
        {item.date}
      </li>
    {/each}
  </ul>