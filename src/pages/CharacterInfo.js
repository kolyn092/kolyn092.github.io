import React from 'react';

// 로스트아크 캐릭터 정보 조회 페이지
const CharacterInfo = React.memo(function CharacterInfo() {

  return (
    <div className="wrapper">
      <section className="sc-info search-page" id="sc-info">
        {/* 그룹 1: 스펙 정보 */}
        <div className="group-info">
          {/* 스펙 포인트 영역 */}
          <div className="spec-area shadow minimum flag on">
            <div className="tier-box">
              <div className="spec-point">2495.29</div>
            </div>
            <div className="gauge-box">
              <div className="gauge">
                <span className="value"></span>
              </div>
            </div>
          </div>

          {/* 상세 정보 영역 */}
          <div className="detail-area shadow">
            {/* 각인 영역 */}
            <div className="engraving-area shadow">
              <div className="engraving-box">
                <img src="/asset/image/skeleton-img.png" className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src="/asset/image/skeleton-img.png" className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src="/asset/image/skeleton-img.png" className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src="/asset/image/skeleton-img.png" className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src="/asset/image/skeleton-img.png" className="engraving-img" alt="" />
              </div>
            </div>

            {/* 카르마 영역 */}
            <div className="karma-area shadow">
              <div className="karma-box">
                <div className="karma">
                  <span className="tag evolution">진화</span>
                  <span className="rank">N랭크</span>
                </div>
                <div className="karma">
                  <span className="tag enlightenment">깨달음</span>
                  <span className="rank">N랭크</span>
                </div>
                <div className="karma">
                  <span className="tag leap">도약</span>
                  <span className="rank">N랭크</span>
                </div>
              </div>
              <div className="report-box"></div>
            </div>
                        {/* 아크 영역 */}
                        <div className="ark-area shadow">
              <div className="ark-list-wrap">
                {/* 진화 아크패시브 */}
                <ul className="ark-list evolution">
                  <li className="title-box evolution">
                    <span className="tag">진화</span>
                    <span className="title">N/A</span>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                </ul>

                {/* 깨달음 아크패시브 */}
                <ul className="ark-list enlightenment">
                  <li className="title-box enlightenment">
                    <span className="tag">깨달음</span>
                    <span className="title">N/A</span>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                </ul>

                {/* 도약 아크패시브 */}
                <ul className="ark-list leap">
                  <li className="title-box leap">
                    <span className="tag">도약</span>
                    <span className="title">N/A</span>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src="/asset/image/skeleton-img.png" alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                </ul>
              </div>
            </div>
            {/* 광고 영역 */}
          </div>
        </div>

          {/* 그룹 2: 장비 정보 */}
          <div className="group-equip">
            {/* 보석 영역 */}
            <div className="gem-area shadow">
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src="/asset/image/skeleton-img.png" alt="" />
              </div>
            </div>

            {/* 장비 래퍼 */}
            <div className="armor-wrap">
              {/* 방어구 영역 */}
              <div className="armor-area shadow">
                <ul className="armor-list">
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap"></div>
                        <div className="elixir-wrap"></div>
                      </div>
                      <div className="hyper-wrap"></div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap"></div>
                        <div className="elixir-wrap"></div>
                      </div>
                      <div className="hyper-wrap"></div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap"></div>
                        <div className="elixir-wrap"></div>
                      </div>
                      <div className="hyper-wrap"></div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap"></div>
                        <div className="elixir-wrap"></div>
                      </div>
                      <div className="hyper-wrap"></div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap"></div>
                        <div className="elixir-wrap"></div>
                      </div>
                      <div className="hyper-wrap"></div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap"></div>
                        <div className="elixir-wrap"></div>
                      </div>
                      <div className="hyper-wrap"></div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                    </div>
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 악세사리 영역 */}
              <div className="accessory-area shadow">
                <ul className="accessory-list">
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">NN</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src="/asset/image/skeleton-img.png" alt="" />
                      <span className="progress">NN</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
});

export default CharacterInfo;
