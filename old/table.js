// Sample data for the table, including image paths for 'type'
const tableData = [
  {
    fi: "1,00",
    d_mm: "6D",
    symbol: "6412 2,78 K/P",
    producent: "ESSEX",
    cenaNetto: "30zł",
    rentaTool: true,
    type: "public/assets/image-10.png",
  },
  {
    fi: "2,78",
    d_mm: "15D",
    symbol: "302312660 K/P",
    producent: "GUHRING",
    cenaNetto: "80zł",
    rentaTool: false,
    type: "public/assets/image-13.png",
  },
  {
    fi: "3,00",
    d_mm: "20D",
    symbol: "A6685TFP-3",
    producent: "WALTER",
    cenaNetto: "50zł",
    rentaTool: false,
    type: "public/assets/image-16.png",
  },
  {
    fi: "3,50",
    d_mm: "16D",
    symbol: "SPC0032-0160",
    producent: "MITSUBISHI",
    cenaNetto: "120zł",
    rentaTool: true,
    type: "public/assets/image-17.png",
  },
  {
    fi: "1,00",
    d_mm: "6D",
    symbol: "6412 2,78 K/P",
    producent: "ESSEX",
    cenaNetto: "30zł",
    rentaTool: true,
    type: "public/assets/image-10.png",
  },
  {
    fi: "2,78",
    d_mm: "15D",
    symbol: "302312660 K/P",
    producent: "GUHRING",
    cenaNetto: "80zł",
    rentaTool: false,
    type: "public/assets/image-13.png",
  },
  {
    fi: "3,00",
    d_mm: "20D",
    symbol: "A6685TFP-3",
    producent: "WALTER",
    cenaNetto: "50zł",
    rentaTool: false,
    type: "public/assets/image-16.png",
  },
  {
    fi: "3,50",
    d_mm: "16D",
    symbol: "SPC0032-0160",
    producent: "MITSUBISHI",
    cenaNetto: "120zł",
    rentaTool: true,
    type: "public/assets/image-17.png",
  },
  {
    fi: "1,00",
    d_mm: "6D",
    symbol: "6412 2,78 K/P",
    producent: "ESSEX",
    cenaNetto: "30zł",
    rentaTool: true,
    type: "public/assets/image-10.png",
  },
  {
    fi: "2,78",
    d_mm: "15D",
    symbol: "302312660 K/P",
    producent: "GUHRING",
    cenaNetto: "80zł",
    rentaTool: false,
    type: "public/assets/image-13.png",
  },
  {
    fi: "3,00",
    d_mm: "20D",
    symbol: "A6685TFP-3",
    producent: "WALTER",
    cenaNetto: "50zł",
    rentaTool: false,
    type: "public/assets/image-16.png",
  },
  {
    fi: "3,50",
    d_mm: "16D",
    symbol: "SPC0032-0160",
    producent: "MITSUBISHI",
    cenaNetto: "120zł",
    rentaTool: true,
    type: "public/assets/image-17.png",
  },
];

// Function to generate the table
function generateTable(data) {
  const tableContainer = document.getElementById("table-container");

  // Create table element
  const table = document.createElement("table");
  table.className = "border-collapse";
  table.style.width = "925px"; // Set fixed width for the table

  // Add table header
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
        <th class="px-4 py-2 bg-white border border-zinc-200 rounded-tl-[15px]">Type</th>
        <th class="px-4 py-2 bg-white border border-zinc-200">⌀</th>
        <th class="px-4 py-2 bg-white border border-zinc-200">D/mm</th>
        <th class="px-4 py-2 bg-white border border-zinc-200">Symbol</th>
        <th class="px-4 py-2 bg-white border border-zinc-200">Producent</th>
        <th class="px-4 py-2 bg-white border border-zinc-200 rounded-tr-[15px]">Cena Netto</th>
      `;
  table.appendChild(headerRow);

  // Add table rows
  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = "hover-row"; // Add a class to each row

    tr.innerHTML = `
          <td class="px-4 py-2 border bg-[rgba(226, 226, 231, 1)] border-zinc-200 max-h-[34px]" style="max-height: 34px;">
              <img src="${
                row.type
              }" alt="Type" class="w-12 h-12 object-contain" />
          </td>
          <td class="px-4 py-2 border bg-[rgba(226, 226, 231, 1)] border-zinc-200 max-h-[34px]" style="max-height: 34px;">${
            row.fi
          }</td>
          <td class="px-4 py-2 border bg-[rgba(226, 226, 231, 1)] border-zinc-200 max-h-[34px]" style="max-height: 34px;">${
            row.d_mm
          }</td>
          <td class="px-4 py-2 border bg-[rgba(226, 226, 231, 1)] border-zinc-200 max-h-[34px]" style="max-height: 34px;">${
            row.symbol
          }</td>
          <td class="px-4 py-2 border bg-[rgba(226, 226, 231, 1)] border-zinc-200 max-h-[34px]" style="max-height: 34px;">${
            row.producent
          }</td>
          
          <td class="px-4 py-2 border bg-[rgba(226, 226, 231, 1)] border-zinc-200 max-h-[34px]" style="max-height: 34px;">${
            row.cenaNetto
          }
            ${
              row.rentaTool
                ? `<button class="ml-2 px-1.5 py-0.5 text-xs font-bold bg-gray-100 border border-cyan-950 rounded-[14px]">rent a tool</button>`
                : ""
            }
          </td>
        `;

    // Add hover effect to update the larger image preview
    tr.addEventListener("mouseover", () => {
      const largeImage = document.getElementById("large-image");
      largeImage.setAttribute("data", row.type);
    });

    table.appendChild(tr);
  });

  // Append the table to the container
  tableContainer.appendChild(table);
}

// Call the function to generate the table
generateTable(tableData);
