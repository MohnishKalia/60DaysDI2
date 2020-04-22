$(document).ready(function () {
    bsCustomFileInput.init()
});

(async () => {
    const dateSmall = document.querySelector("#dateSmall");
    const daySmall = document.querySelector("#daySmall");
    const topicH = document.querySelector("#topic");
    const locationH = document.querySelector("#location");

    const res = await fetch('/topic');
    const payload = await res.json();

    const {
        week,
        day,
        daySpan,
        location,
        topic,
    } = payload;

    dateSmall.textContent = `(week ${week}, day ${daySpan + 1})`;
    daySmall.textContent = `(${day})`
    topicH.textContent = topic;
    locationH.textContent = location;
})();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const fileId = urlParams.get('fileId');
if (fileId) {
    const fid = `https://drive.google.com/file/d/${fileId}/view`;
    const place = document.querySelector('a#photolink');
    place.href = fid;
    place.textContent = fid
}