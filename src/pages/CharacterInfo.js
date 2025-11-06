import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHttp } from '../hooks/useHttp';

// 로스트아크 캐릭터 정보 조회 페이지
const CharacterInfo = React.memo(function CharacterInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 검색 입력 필드용 state
  const [searchInput, setSearchInput] = useState(searchParams.get('name') || '');
  // 캐릭터 이름 표시용 state (검색 버튼 클릭 또는 새로고침 시에만 업데이트)
  const [displayCharacterName, setDisplayCharacterName] = useState(searchParams.get('name') || '');
  const { loading, error, get } = useHttp();
  
  // 캐릭터 정보 상태
  const [characterData, setCharacterData] = useState(null);
  
  // 중복 요청 방지를 위한 ref
  const fetchingRef = useRef(false);
  const lastFetchedNameRef = useRef('');

  // URL 파라미터가 변경될 때 searchInput 동기화
  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    if (nameFromUrl) {
      setSearchInput(nameFromUrl);
    }
  }, [searchParams.get('name')]);

  // URL 파라미터의 characterName이 변경될 때마다 API 호출
  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    
    if (!nameFromUrl || !nameFromUrl.trim()) {
      setCharacterData(null);
      setDisplayCharacterName('');
      fetchingRef.current = false;
      lastFetchedNameRef.current = '';
      return;
    }

    const trimmedName = nameFromUrl.trim();
    
    // 동일한 이름으로 이미 요청 중이면 중복 요청 방지
    if (fetchingRef.current && lastFetchedNameRef.current === trimmedName) {
      console.log('이미 요청 중인 캐릭터입니다:', trimmedName);
      return;
    }

    // 이미 동일한 이름을 요청한 경우 중복 요청 방지
    if (lastFetchedNameRef.current === trimmedName) {
      console.log('이미 요청한 캐릭터입니다:', trimmedName);
      return;
    }

    fetchingRef.current = true;
    lastFetchedNameRef.current = trimmedName;

    const fetchData = async () => {
      try {
        const encodedName = encodeURIComponent(trimmedName);
        const filters = ['profiles', 'equipment', 'combat-skills', 'engravings', 'cards', 'gems', 'arkpassive', 'arkgrid'].join('%2B');
        const endpoint = `/armories/characters/${encodedName}?filters=${filters}`;
        const data = await get(endpoint);
        console.log('조회 결과 데이터:', data);
        setCharacterData(data);
        // API 응답으로 받은 캐릭터 이름으로 displayCharacterName state 업데이트
        if (data?.CharacterName) {
          setDisplayCharacterName(data.CharacterName);
        } else {
          // API 응답에 CharacterName이 없으면 URL 파라미터의 이름 사용
          setDisplayCharacterName(trimmedName);
        }
      } catch (err) {
        console.error('캐릭터 정보 조회 실패:', err);
        setCharacterData(null);
        // 에러 발생 시에도 URL 파라미터의 이름으로 표시
        setDisplayCharacterName(trimmedName);
        lastFetchedNameRef.current = ''; // 에러 발생 시 초기화
      } finally {
        fetchingRef.current = false;
      }
    };

    fetchData();
  }, [searchParams.get('name'), get]);

  // default image path
  const defaultImage = '/asset/image/skeleton-img.png';

  // API 응답 데이터에서 필요한 정보 추출 (null-safe)
  const level = characterData?.ArmoryProfile?.CharacterLevel || '';
  const jobName = characterData?.ArmoryProfile?.CharacterClassName || '';
  const server = characterData?.ArmoryProfile?.ServerName || '';
  const itemLevel = characterData?.ArmoryProfile?.ItemAvgLevel || '';
  const guildName = characterData?.ArmoryProfile?.GuildName || '';
  const specPoint = characterData?.ArmoryProfile?.CombatPower || '';
  const characterImage = characterData?.ArmoryProfile?.CharacterImage || defaultImage;
  
  const engraving = characterData?.ArmoryEngraving?.ArkPassiveEffects || [];

  const equipment = characterData?.ArmoryEquipment || [];
  const equipmentImages = equipment.slice(0, 16).map(equipment => equipment?.Icon || defaultImage);
  while (equipmentImages.length < 16) {
    equipmentImages.push(defaultImage);
  } 

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/character-info?name=${encodeURIComponent(searchInput.trim())}`);
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            placeholder="캐릭터명을 입력하세요"
            className="character-search-input"
          />
          <button
            onClick={handleSearch}
              disabled={!searchInput.trim()}
            className="search-button"
          >
              검색
          </button>
          </div>
        </div>
                </div>

      {/* 로딩 상태 */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>캐릭터 정보를 불러오는 중...</p>
          </div>
        )}

      {/* 에러 상태 */}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>오류: {error}</p>
        </div>
      )}

      {/* 캐릭터 정보 요약 박스 */}
      {!loading && (
        <div className="character-summary-box shadow">
          <div className="character-avatar">
            <img src={characterImage} alt="캐릭터 아바타" />
          </div>
          <div className="character-basic-info">
            <div className="character-name">
              <span className="character-name">Lv. {level || ''} </span>
              <span className="character-name">{displayCharacterName || characterData?.CharacterName || ''} </span>
              <span className="character-name">| {jobName || ''}</span>
            </div>
            <div className="character-details">
              <span className="character-server">서버 : {server || ''}</span>
              <span className="character-server">레벨 : {itemLevel || ''}</span>
              <span className="character-server">길드 : {guildName || ''}</span>
            </div>
          </div>
        </div>
      )}

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
                <img src={defaultImage} className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src={defaultImage} className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src={defaultImage} className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src={defaultImage} className="engraving-img" alt="" />
              </div>
              <div className="engraving-box">
                <img src={defaultImage} className="engraving-img" alt="" />
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
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
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
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
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
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
                    </div>
                    <div className="text-box"></div>
                  </li>
                  <li className="ark-item">
                    <div className="img-box">
                      <span className="tier">N</span>
                      <img src={defaultImage} alt="아크패시브" />
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
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
                  </div>
              <div className="gem-box radius skeleton">
                <img src={defaultImage} alt="" />
              </div>
            </div>

            {/* 장비 래퍼 */}
            <div className="armor-wrap">
              {/* 방어구 영역 */}
              <div className="armor-area shadow">
                <ul className="armor-list">
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src={equipmentImages[1]} alt="" />
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
                      <img src={equipmentImages[5]} alt="" />
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
                      <img src={equipmentImages[2]} alt="" />
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
                      <img src={equipmentImages[3]} alt="" />
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
                      <img src={equipmentImages[4]} alt="" />
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
                  {/* 무기 */}
                  <li className="armor-item">
                    <div className="img-box radius skeleton">
                      <img src={equipmentImages[0]} alt="" />
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
                      <img src={defaultImage} alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap"></div>
                    </div>
                    <div className="img-box radius skeleton">
                      <img src={defaultImage} alt="" />
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
                      <img src={equipmentImages[6]} alt="" />
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
                      <img src={equipmentImages[7]} alt="" />
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
                      <img src={equipmentImages[8]} alt="" />
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
                      <img src={equipmentImages[9]} alt="" />
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
                      <img src={equipmentImages[10]} alt="" />
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
                      <img src={equipmentImages[11]} alt="" />
                      <span className="progress">NN</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap"></div>
                      <div className="grinding-wrap"></div>
                    </div>
                  </li>
                   {/* 팔찌 */}
                  <li className="accessory-item">
                    <div className="img-box radius skeleton">
                      <img src={equipmentImages[12]} alt="" />
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
