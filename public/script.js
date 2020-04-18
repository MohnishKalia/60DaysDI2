(async () => {
    const photoDiv = document.querySelector("#samplephotos");
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

    dateSmall.textContent = `(wk. ${week}, d. ${daySpan})`;
    daySmall.textContent = `(${day})`
    topicH.textContent = topic;
    locationH.textContent = location;
})();