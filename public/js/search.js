const searchBtn = document.getElementById("search-btn");
const search = document.getElementById("search");

let input="";
search.addEventListener("change",()=>{
    input = search.value;
});

searchBtn.addEventListener("click",()=>{
    input = input.trim();
    window.location.href = `/listing/search/${encodeURIComponent(input)}`;
})
