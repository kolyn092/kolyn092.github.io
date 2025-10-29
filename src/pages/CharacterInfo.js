import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 로스트아크 캐릭터 정보 조회 페이지
const CharacterInfo = React.memo(function CharacterInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [characterName, setCharacterName] = useState(searchParams.get('name') || '');
  
  // 캐릭터 정보 변수들 (나중에 API에서 받아올 데이터)
  const level = '';
  const jobName = '';
  const server = '';
  const itemLevel = '';
  const guildName = '';
  const specPoint = '1231';

  const handleSearch = () => {
    if (characterName.trim()) {
      navigate(`/character-info?name=${encodeURIComponent(characterName.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="character-info-page">
      {/* 검색 섹션 */}
      <div className="character-search-section">
        <div className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="캐릭터명을 입력하세요"
              className="character-search-input"
            />
            <button
              onClick={handleSearch}
              disabled={!characterName.trim()}
              className="search-button"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 캐릭터 정보 요약 박스 */}
      <div className="character-summary-box shadow">
        <div className="character-avatar">
          <img src="/asset/image/skeleton-img.png" alt="캐릭터 아바타" />
        </div>
        <div className="character-basic-info">
          <div className="character-name">
            <span className="character-name">Lv. {level || ''} </span>
            <span className="character-name">{characterName || ''} </span>
            <span className="character-name">| {jobName || ''}</span>
          </div>
          <div className="character-details">
            <span className="character-server">서버 : {server || ''}</span>
            <span className="character-server">레벨 : {itemLevel || ''}</span>
            <span className="character-server">길드 : {guildName || ''}</span>
          </div>
        </div>
      </div>

      {/* 캐릭터 정보 컨텐츠 */}
      <div className="wrapper">
      <section className="sc-info search-page" id="sc-info">
        {/* 그룹 1: 스펙 정보 */}
        <div className="group-info">
          {/* 스펙 포인트 영역 */}
          <div className="spec-area shadow minimum flag on">
            <div className="tier-box">
              <div className="spec-point">{specPoint || ''}</div>
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
    </div>
  );
});

export default CharacterInfo;
