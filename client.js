function getSingleVidoReq(videoInfo) {
  const videoReqContainerElm = document.createElement("div");
  const videoReqTemplate = `<div class="card mb-3">
    <div class="card-body d-flex justify-content-between flex-row">
      <div class="d-flex flex-column">
        <h3>${videoInfo.topic_title}</h3>
        <p class="text-muted mb-2">${videoInfo.topic_details}</p>
        <p class="mb-0 text-muted">
          <strong>Expected results:</strong> ${videoInfo.expected_result}
        </p>
      </div>
      <div class="d-flex flex-column text-center">
        <a id="votes_ups_${videoInfo._id}" class="btn btn-link">🔺</a>
        <h3 id="score_vote_${videoInfo._id}">${
    videoInfo.votes.ups - videoInfo.votes.downs
  }</h3>
        <a id="votes_downs_${videoInfo._id}"class="btn btn-link">🔻</a>
      </div>
    </div>
    <div class="card-footer d-flex flex-row justify-content-between">
      <div>
        <span class="text-info">${videoInfo.status.toUpperCase()}</span>
        &bullet; added by <strong>${videoInfo.author_name}</strong> on
        <strong>${new Date(videoInfo.submit_date).toLocaleDateString()}</strong>
      </div>
      <div
        class="d-flex justify-content-center flex-column 408ml-auto mr-2"
      >
        <div class="badge badge-success">${videoInfo.target_level}</div>
      </div>
    </div>
  </div>`;

  videoReqContainerElm.innerHTML = videoReqTemplate;
  return videoReqContainerElm;
}

document.addEventListener("DOMContentLoaded", function () {
  const formVidReqElm = document.getElementById("formVideoRequest");
  const listfVideosElm = document.getElementById("listOfRequests");

  fetch("http://localhost:7777/video-request")
    .then((blob) => blob.json())
    .then((data) =>
      data.forEach((videoInfo) => {
        listfVideosElm.appendChild(getSingleVidoReq(videoInfo)); //  after appending this element we can select any elemnt on it
        //update vote score
        const votesUpsElm = document.getElementById(
          `votes_ups_${videoInfo._id}`
        );
        const votesDownsElm = document.getElementById(
          `votes_downs_${videoInfo._id}`
        );

        const scoreVoreElm = document.getElementById(
          `score_vote_${videoInfo._id}`
        );
        votesDownsElm.addEventListener("click", (e) => {
          fetch("http://localhost:7777/video-request/vote", {
            method: "PUT",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ id: videoInfo._id, vote_type: "downs" }),
          })
            .then((bolb) => bolb.json())
            .then((data) => (scoreVoreElm.innerText = data.ups - data.downs));
        });
        votesUpsElm.addEventListener("click", (e) => {
          fetch("http://localhost:7777/video-request/vote", {
            method: "PUT",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ id: videoInfo._id, vote_type: "ups" }),
          })
            .then((bolb) => bolb.json())
            .then((data) => (scoreVoreElm.innerText = data.ups - data.downs));
        });
      })
    );

  addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formVidReqElm);
    fetch("http://localhost:7777/video-request", {
      method: "POST",
      body: formData,
    })
      .then((bold) => bold.json())
      .then((data) => {
        listfVideosElm.prepend(getSingleVidoReq(data));
      });
  });
});
