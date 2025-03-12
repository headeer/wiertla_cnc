const products = [
  {
    fi: "1,00",
    dimension: "6D",
    symbol: "...",
    producent: "ESSEX",
    price: "30zł",
    rentTool: true,
    image: "/assets/image-8.png",
  },
  {
    fi: "1,60",
    dimension: "17,6 mm",
    symbol: "12300-1,6",
    producent: "GARANT",
    price: "35zł",
    rentTool: false,
    image: "/assets/image-10.png",
  },
  {
    fi: "3,00",
    dimension: "16D",
    symbol: "A6685TFP-3",
    producent: "WALTER",
    price: "180zł",
    rentTool: false,
    image: "/assets/image-11.png",
  },
  {
    fi: "1,00",
    dimension: "102 mm",
    symbol: "MSP0302",
    producent: "MITSUBISHI",
    price: "120zł",
    rentTool: true,
    image: "/assets/image-13.png",
  },
  {
    fi: "3,20",
    dimension: "5D",
    symbol: "SPC0032-0160",
    producent: "ARNO",
    price: "90zł",
    rentTool: true,
    image: "/assets/image-8.png",
  },
  {
    fi: "3,20",
    dimension: "5D",
    symbol: "SPC0032-0160",
    producent: "ARNO",
    price: "90zł",
    rentTool: true,
    image: "/assets/image-8.png",
  },
  {
    fi: "3,20",
    dimension: "5D",
    symbol: "SPC0032-0160",
    producent: "ARNO",
    price: "90zł",
    rentTool: true,
    image: "/assets/image-8.png",
  },
];

function createSwiperSlides(products) {
  const swiperWrapper = document.getElementById("swiper-wrapper");

  products.forEach((product) => {
    const rentToolButton = product.rentTool
      ? `<div class="flex items-center justify-center rounded-[14px] border-2 border-cyan-950 bg-white px-1.5 py-0.5 text-xs font-bold tracking-[0.16px]">
            rent a tool
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12" viewBox="0 0 17 12" fill="none" class="ml-1">
            <path id="Vector" d="M10.5 12L9.1 10.55L12.65 7H0.5V5H12.65L9.1 1.45L10.5 0L16.5 6L10.5 12Z" fill="#112832"/>
          </svg>`
      : "";
    const truncatedProducent = truncateProducent(product.producent);

    const slideHTML = `
        <div class="swiper-slide flex items-center justify-center bg-white w-[264px] h-[102px] p-2.5">
          <div class="w-full h-full flex flex-col justify-between">
            <!-- First Row: Image, Fi, Dimension -->
            <div class="flex items-center justify-between h-[34px]">
              <div class="min-w-[34px] max-h-[34px] w-[34px] h-[34px] border-t-2 border-b-2 border-[#112832]">
                <img src="${product.image}" alt="Product Image" class="w-full h-full object-cover" />
              </div>
              <div class="flex w-full min-h-[34px] items-center border-2 border-[#112832] border-x-0 px-2 py-1">fi ⌀ ${product.fi}</div>
              <div class="border-2 min-h-[34px] w-full border-[#112832] px-3 py-1">${product.dimension}</div>
            </div>

            <!-- Second Row: Symbol -->
            <div class="border-b-2 min-h-[34px] border-l-2 border-r-2 border-gray-300 h-[34px] flex items-center px-2">${product.symbol}</div>

            <!-- Third Row: Producent, Price + Rent Tool -->
            <div class="flex items-center justify-between h-[34px]">
            <div class="border-l-2 min-h-[34px] border-b-2 border-gray-300 px-2 flex-grow align-center justify-start items-center flex">${truncatedProducent}</div>
              <div class="flex items-center min-h-[34px] border-2 border-gray-300 border-t-0 rounded-br-[15px] ">
                <div class="mx-3">${product.price}</div>
                ${rentToolButton}
              </div>
            </div>
          </div>
        </div>`;

    swiperWrapper.innerHTML += slideHTML;
  });
}
function truncateProducent(producent) {
  if (producent.length > 5) {
    return producent.slice(0, 2) + "...";
  }
  return producent;
}

createSwiperSlides(products);

// Initialize Swiper
var swiper = new Swiper(".swiper-container", {
  slidesPerView: 5, // Number of slides visible at the same time
  spaceBetween: 25, // Space between slides
  loop: false, // Enable infinite loop
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1490: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
  on: {
    slideChange: function () {
      updatePaginationBars(this.realIndex);
    },
  },
});

// Function to update the custom pagination bars
function updatePaginationBars(activeIndex) {
  const paginationBars = document.querySelectorAll(".pagination-bar");

  paginationBars.forEach((bar, index) => {
    if (index === activeIndex) {
      bar.classList.add("pagination-active");
      bar.classList.remove("pagination-inactive");
    } else {
      bar.classList.add("pagination-inactive");
      bar.classList.remove("pagination-active");
    }
  });
}

// Set initial pagination state
updatePaginationBars(0);
