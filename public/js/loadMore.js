document.addEventListener("DOMContentLoaded", function () {
    let currfilter = window.appData.filter || ""; // Read from global variable
    let currPage = window.appData.currPage || 1;

    const show = document.querySelector(".show-btn");
    const container = document.getElementById("listings-container");

    if (show) {
        show.addEventListener("click", async () => {
            try {
                let response;
                if (currfilter) {
                    response = await fetch(`/listing/category/${encodeURIComponent(currfilter)}?page=${currPage}&ajax=true`);
                } else {
                    response = await fetch(`/listing?page=${currPage}&ajax=true`);
                }

                const data = await response.json();

                if (!data.allListings.length) {
                    show.style.display = "none";
                    return;
                }

                data.allListings.forEach(listing => {
                    const listingHtml = `
                        <a href="/listing/${listing._id}" class="listing-link">
                            <div class="card col">
                                <img src="${listing.image.url}" class="card-img-top" alt="listing_image" style="height: 20rem;">
                                <div class="card-img-overlay"></div>
                                <div class="card-body">
                                    <p class="card-text">
                                        <b>${listing.title}</b> <br>
                                        &#x20b9; ${listing.price.toLocaleString("en-IN")}/night
                                    </p>
                                </div>
                            </div>
                        </a>`;
                    container.insertAdjacentHTML("beforeend", listingHtml);
                });

                currPage = data.next;
                if (!data.hasNextPage) {
                    show.style.display = "none";
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        });
    }
});
