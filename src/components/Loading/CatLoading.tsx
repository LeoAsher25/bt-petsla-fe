import React from "react";

import "./CatLoading.scss";

const CatLoading = () => {
  return (
    <div id="cat-loading-wrap">
      <div className="box">
        <div className="cat">
          <div className="cat__body"></div>
          <div className="cat__body"></div>
          <div className="cat__tail"></div>
          <div className="cat__head"></div>
        </div>
      </div>
      <h1 className="loading-text">Đang tải</h1>

      {/* <blockquote className="info">
        inspired from <a href="https://dribbble.com/domaso">domaso</a>'s
        dribbble:{" "}
        <a href="https://dribbble.com/shots/3197970-Loading-cat">Loading cat</a>
        <br />
        fork from <a href="https://www.facebook.com/tenyoku8478">
          林天翼
        </a>'s{" "}
        <a href="https://www.csie.ntu.edu.tw/~b02902062/load_cat/">load cat</a>
        via:{" "}
        <a href="https://www.facebook.com/groups/f2e.tw/permalink/1180443255326371/?comment_id=1180487985321898">
          FB comment
        </a>
      </blockquote> */}
    </div>
  );
};

export default CatLoading;
