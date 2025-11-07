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
  const equipmentGrades = equipment.slice(0, 16).map(equipment => equipment?.Grade || '');
  // equipmentGrades 배열을 16개로 채우기 (부족한 경우 빈 문자열로 채움)
  while (equipmentGrades.length < 16) {
    equipmentGrades.push('');
  }
  
  // Grade 값에 따라 CSS 클래스 이름을 반환하는 함수
  const getGradeClass = (grade) => {
    if (!grade) return '';
    const gradeLower = grade.toLowerCase();
    if (gradeLower.includes('hero') || gradeLower === '영웅') return 'grade-hero';
    if (gradeLower.includes('legend') || gradeLower === '전설') return 'grade-legend';
    if (gradeLower.includes('ancient') || gradeLower === '고대') return 'grade-ancient';
    if (gradeLower.includes('relic') || gradeLower === '유물') return 'grade-relic';
    return '';
  };

  // Tooltip 데이터에서 HTML 태그 제거하는 함수
  const stripHtmlTags = (html) => {
    if (!html) return '';
    // 문자열이 아닌 경우 문자열로 변환
    if (typeof html !== 'string') {
      html = String(html);
    }
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Tooltip 데이터에서 필요한 정보를 파싱하는 함수
  const parseTooltipData = (tooltip) => {
    if (!tooltip) {
      return {
        equipmentName: '',
        qualityValue: null,
        honingLevel: null,
        transcendenceLevel: null,
        transcendenceGrade: null,
        stats: [],
        honingEffects: []
      };
    }

    // Tooltip이 문자열인 경우 JSON.parse
    let parsedTooltip = tooltip;
    if (typeof tooltip === 'string') {
      try {
        parsedTooltip = JSON.parse(tooltip);
      } catch (e) {
        console.error('Tooltip JSON 파싱 실패:', e);
        return {
          qualityValue: null,
          stats: [],
          honingEffects: []
        };
      }
    }

    // 장비 이름 추출 (Element_000.value에서 "+24 운명의 업화 리아네 하프" 추출)
    // "<P ALIGN='CENTER'><FONT COLOR='#E3C7A1'>+24 운명의 업화 리아네 하프</FONT></P>" 형식에서 HTML 태그 제거
    let equipmentName = '';
    const nameText = parsedTooltip?.Element_000?.value;
    if (nameText && typeof nameText === 'string') {
      equipmentName = stripHtmlTags(nameText);
    }

    // qualityValue 추출 (Element_001.value.qualityValue)
    const qualityValue = parsedTooltip?.Element_001?.value?.qualityValue ?? null;

    // 재련 단계 추출 (Element_005.value에서 "40" 추출)
    // "<FONT COLOR='#FFD200'>40</FONT>단계" 형식에서 40 추출
    let honingLevel = null;
    const honingValue = parsedTooltip?.Element_005?.value;
    if (honingValue && typeof honingValue === 'string') {
      const cleanHoningText = stripHtmlTags(honingValue);
      const honingMatch = cleanHoningText.match(/(\d+)\s*단계/);
      if (honingMatch) {
        honingLevel = parseInt(honingMatch[1], 10);
      }
    }

    // 초월 단계와 레벨 추출
    // 무기: Element_010.value.Element_000.topStr에서 추출
    // "<FONT COLOR='#FFD200'>7</FONT>단계 <img src='emoticon_Transcendence_Grade' width='18' height='18' vspace ='-4'></img>21" 형식에서 7과 21 추출
    let transcendenceLevel = null;
    let transcendenceGrade = null;
    
    // Element_010이 IndentStringGroup 타입인 경우 value.Element_000.topStr 확인
    let transcendenceText = null;
    if (parsedTooltip?.Element_010?.type === 'IndentStringGroup') {
      // IndentStringGroup 타입의 경우 value.Element_000.topStr 확인
      transcendenceText = parsedTooltip?.Element_010?.value?.Element_000?.topStr;
    } else if (parsedTooltip?.Element_010?.type === 'Progress') {
      // Progress 타입의 경우 value.value 또는 value.topStr 확인
      transcendenceText = parsedTooltip?.Element_010?.value?.topStr || 
                          parsedTooltip?.Element_010?.value?.value ||
                          parsedTooltip?.Element_010?.value;
    } else {
      // 다른 타입의 경우 기존 로직 사용
      transcendenceText = parsedTooltip?.Element_010?.value?.topStr;
    }
    
    // 문자열이 아닌 경우 문자열로 변환 시도
    if (transcendenceText && typeof transcendenceText !== 'string') {
      transcendenceText = String(transcendenceText);
    }
    
    if (transcendenceText && typeof transcendenceText === 'string') {
      const cleanTranscendenceText = stripHtmlTags(transcendenceText);
      // "7단계 21" 형식에서 7과 21 추출
      // 정규식을 더 유연하게 수정: 숫자 사이에 공백이나 다른 문자가 있을 수 있음
      // 먼저 "7단계 21" 형식 시도 (공백 있음)
      const transcendenceMatch = cleanTranscendenceText.match(/(\d+)\s*단계\s+(\d+)/);
      if (transcendenceMatch) {
        transcendenceLevel = parseInt(transcendenceMatch[1], 10);
        transcendenceGrade = parseInt(transcendenceMatch[2], 10);
      } else {
        // 다른 형식 시도: "7단계21" (공백 없음)
        const altMatch1 = cleanTranscendenceText.match(/(\d+)단계(\d+)/);
        if (altMatch1) {
          transcendenceLevel = parseInt(altMatch1[1], 10);
          transcendenceGrade = parseInt(altMatch1[2], 10);
        } else {
          // "7 21" 형식 (단계 없이 숫자만)
          const altMatch2 = cleanTranscendenceText.match(/(\d+)\s+(\d+)/);
          if (altMatch2) {
            transcendenceLevel = parseInt(altMatch2[1], 10);
            transcendenceGrade = parseInt(altMatch2[2], 10);
          }
        }
      }
    }

    // 기본 효과 추출
    // 악세사리: Element_004.value.Element_001 (ItemPartBox 타입)
    // 무기: Element_006.value.Element_001 (ItemPartBox 타입)
    let baseEffectsText = '';
    // Element_004가 ItemPartBox 타입인 경우 (악세사리)
    if (parsedTooltip?.Element_004?.type === 'ItemPartBox') {
      baseEffectsText = parsedTooltip?.Element_004?.value?.Element_001 || '';
    }
    // Element_004가 ItemPartBox가 아니거나 없는 경우 Element_006 확인 (무기 장비)
    else if (parsedTooltip?.Element_006?.type === 'ItemPartBox') {
      baseEffectsText = parsedTooltip?.Element_006?.value?.Element_001 || '';
    }
    const stats = [];
    if (baseEffectsText && typeof baseEffectsText === 'string') {
      // <BR> 태그를 줄바꿈으로 변환 (대소문자 구분 없이)
      let textWithNewlines = baseEffectsText.replace(/<BR\s*\/?>/gi, '\n');
      // <br> 태그도 줄바꿈으로 변환
      textWithNewlines = textWithNewlines.replace(/<br\s*\/?>/gi, '\n');
      // HTML 태그 제거
      const cleanText = stripHtmlTags(textWithNewlines);
      // 줄바꿈으로 분리
      const lines = cleanText.split(/\r?\n/).filter(line => line.trim());
      
      lines.forEach(line => {
        // "힘 +17750" 형식에서 스탯 이름과 값을 추출
        // 숫자 앞에 + 기호가 있을 수도 있고 없을 수도 있음
        const match = line.match(/(힘|민첩|지능|체력)\s*\+?\s*(\d+)/);
        if (match) {
          stats.push({
            name: match[1],
            value: parseInt(match[2], 10)
          });
        }
      });
    }

    // 연마 효과 추출
    // 악세사리: Element_006.value.Element_001 (ItemPartBox 타입)
    // 무기: Element_008.value.Element_001 (ItemPartBox 타입 - 추가 효과)
    let honingEffectsText = '';
    // Element_004가 ItemPartBox인 경우 (악세사리) - Element_006이 연마 효과
    if (parsedTooltip?.Element_004?.type === 'ItemPartBox') {
      honingEffectsText = parsedTooltip?.Element_006?.value?.Element_001 || '';
    } 
    // Element_006이 기본 효과로 사용된 경우 (무기) - Element_008이 추가 효과
    else if (parsedTooltip?.Element_006?.type === 'ItemPartBox') {
      honingEffectsText = parsedTooltip?.Element_008?.value?.Element_001 || '';
    }
    // 그 외의 경우 Element_006 확인
    else {
      honingEffectsText = parsedTooltip?.Element_006?.value?.Element_001 || '';
    }
    const honingEffects = [];
    if (honingEffectsText && typeof honingEffectsText === 'string') {
      // <br> 태그를 줄바꿈으로 변환
      let textWithNewlines = honingEffectsText.replace(/<br\s*\/?>/gi, '\n');
      // HTML 태그 제거 (img 태그는 먼저 제거)
      textWithNewlines = textWithNewlines.replace(/<img[^>]*>/gi, '');
      const cleanText = stripHtmlTags(textWithNewlines);
      const lines = cleanText.split(/\r?\n/).filter(line => line.trim());
      
      lines.forEach(line => {
        // "낙인력 +8.00%" 또는 "무기 공격력 +960" 형식에서 효과 이름과 값을 추출
        const match = line.match(/(.+?)\s*\+?\s*([\d.]+)\s*%?/);
        if (match) {
          honingEffects.push({
            name: match[1].trim(),
            value: parseFloat(match[2])
          });
        }
      });
    }

    return {
      equipmentName,
      qualityValue,
      honingLevel,
      transcendenceLevel,
      transcendenceGrade,
      stats,
      honingEffects
    };
  };
  
  // 각 장비의 Tooltip 데이터 파싱
  const equipmentTooltips = equipment.slice(0, 16).map((equipment, index) => {
    if (equipment?.Tooltip) {
      // 디버깅: 무기(인덱스 0)의 Element_010 구조 확인
      if (index === 0) {
        let tooltipData = equipment.Tooltip;
        if (typeof tooltipData === 'string') {
          try {
            tooltipData = JSON.parse(tooltipData);
          } catch (e) {
            console.error('Tooltip JSON 파싱 실패:', e);
          }
        }
        console.log('무기(인덱스 0) Element_010 구조:', tooltipData?.Element_010);
        console.log('무기(인덱스 0) Element_010.value:', tooltipData?.Element_010?.value);
        if (tooltipData?.Element_010?.value?.Element_000) {
          console.log('무기(인덱스 0) Element_010.value.Element_000.topStr:', tooltipData?.Element_010?.value?.Element_000?.topStr);
        }
        if (tooltipData?.Element_010?.value) {
          console.log('무기(인덱스 0) Element_010.value.topStr:', tooltipData?.Element_010?.value?.topStr);
          console.log('무기(인덱스 0) Element_010.value.value:', tooltipData?.Element_010?.value?.value);
        }
      }
      const parsed = parseTooltipData(equipment.Tooltip);
      // 디버깅: 무기(인덱스 0)의 파싱 결과 확인
      if (index === 0) {
        console.log('무기(인덱스 0) 파싱 결과:', parsed);
      }
      // 디버깅: 6번째 장비(인덱스 6)의 데이터 확인
      if (index === 6) {
        console.log('6번째 장비 파싱 결과:', parsed);
      }
      return parsed;
    }
    return {
      equipmentName: '',
      qualityValue: null,
      honingLevel: null,
      transcendenceLevel: null,
      transcendenceGrade: null,
      stats: [],
      honingEffects: []
    };
  });
  // equipmentTooltips 배열을 16개로 채우기
  while (equipmentTooltips.length < 16) {
    equipmentTooltips.push({
      equipmentName: '',
      qualityValue: null,
      honingLevel: null,
      transcendenceLevel: null,
      transcendenceGrade: null,
      stats: [],
      honingEffects: []
    });
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
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[1])}`}>
                      <img src={equipmentImages[1]} alt="" />
                      <span className="progress">{equipmentTooltips[1]?.qualityValue || ''}</span>
                    </div>
                    <div className="armor-text-box">
                    <div className="name-wrap">
                        {equipmentTooltips[1]?.equipmentName || ''} {equipmentTooltips[1]?.honingLevel ? `+${equipmentTooltips[1].honingLevel}` : '0'}
                      </div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap">엘릭서1</div>
                        <div className="elixir-wrap">엘릭서2</div>
                      </div>
                      <div className="hyper-wrap">
                        {equipmentTooltips[1]?.transcendenceLevel || ''}단계 {equipmentTooltips[0]?.transcendenceGrade || ''} 레벨
                      </div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[5])}`}>
                      <img src={equipmentImages[5]} alt="" />
                      <span className="progress">{equipmentTooltips[5]?.qualityValue || ''}</span>
                    </div>
                    <div className="armor-text-box">
                    <div className="name-wrap">
                        {equipmentTooltips[5]?.equipmentName || ''} {equipmentTooltips[5]?.honingLevel ? `+${equipmentTooltips[5].honingLevel}` : '0'}
                      </div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap">엘릭서1</div>
                        <div className="elixir-wrap">엘릭서2</div>
                      </div>
                      <div className="hyper-wrap">
                        {equipmentTooltips[5]?.transcendenceLevel || ''}단계 {equipmentTooltips[0]?.transcendenceGrade || ''} 레벨
                      </div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[2])}`}>
                      <img src={equipmentImages[2]} alt="" />
                      <span className="progress">{equipmentTooltips[2]?.qualityValue || ''}</span>
                    </div>
                    <div className="armor-text-box">
                    <div className="name-wrap">
                        {equipmentTooltips[2]?.equipmentName || ''} {equipmentTooltips[2]?.honingLevel ? `+${equipmentTooltips[2].honingLevel}` : '0'}
                      </div> 
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap">엘릭서1</div>
                        <div className="elixir-wrap">엘릭서2</div>
                      </div>
                      <div className="hyper-wrap">
                        {equipmentTooltips[2]?.transcendenceLevel || ''}단계 {equipmentTooltips[0]?.transcendenceGrade || ''} 레벨
                      </div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[3])}`}>
                      <img src={equipmentImages[3]} alt="" />
                      <span className="progress">{equipmentTooltips[3]?.qualityValue || ''}</span>
                    </div>
                    <div className="armor-text-box">
                    <div className="name-wrap">
                        {equipmentTooltips[3]?.equipmentName || ''} {equipmentTooltips[3]?.honingLevel ? `+${equipmentTooltips[3].honingLevel}` : '0'}
                      </div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap">엘릭서1</div>
                        <div className="elixir-wrap">엘릭서2</div>
                      </div>
                      <div className="hyper-wrap">
                        {equipmentTooltips[3]?.transcendenceLevel || ''}단계 {equipmentTooltips[0]?.transcendenceGrade || ''} 레벨
                      </div>
                    </div>
                  </li>
                  <li className="armor-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[4])}`}>
                      <img src={equipmentImages[4]} alt="" />
                      <span className="progress">{equipmentTooltips[4]?.qualityValue || ''}</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap">
                        {equipmentTooltips[4]?.equipmentName || ''} {equipmentTooltips[4]?.honingLevel ? `+${equipmentTooltips[4].honingLevel}` : '0'}
                      </div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap">엘릭서1</div>
                        <div className="elixir-wrap">엘릭서2</div>
                      </div>
                      <div className="hyper-wrap">
                        {equipmentTooltips[4]?.transcendenceLevel || ''}단계 {equipmentTooltips[0]?.transcendenceGrade || ''} 레벨
                      </div>
                    </div>
                  </li>
                  {/* 무기 */}
                  <li className="armor-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[0])}`}>
                      <img src={equipmentImages[0]} alt="" />
                      <span className="progress">{equipmentTooltips[0]?.qualityValue || ''}</span>
                    </div>
                    <div className="armor-text-box">
                      <div className="name-wrap">
                        {equipmentTooltips[0]?.equipmentName || ''} {equipmentTooltips[0]?.honingLevel ? `+${equipmentTooltips[0].honingLevel}` : '0'}
                      </div>
                      <div className="elixir-wrap-container">
                        <div className="elixir-wrap">엘릭서1</div>
                        <div className="elixir-wrap">엘릭서2</div>
                      </div>
                      <div className="hyper-wrap">
                        {equipmentTooltips[0]?.transcendenceLevel || ''}단계 {equipmentTooltips[0]?.transcendenceGrade || ''} 레벨
                      </div>
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
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[6])}`}>
                      <img src={equipmentImages[6]} alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap">
                        {equipmentTooltips[6]?.stats[0] ? `힘/민첩/지능 +${equipmentTooltips[6].stats[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[6]?.honingEffects[0] ? `${equipmentTooltips[6].honingEffects[0].name} +${equipmentTooltips[6].honingEffects[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[6]?.honingEffects[1] ? `${equipmentTooltips[6].honingEffects[1].name} +${equipmentTooltips[6].honingEffects[1].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[6]?.honingEffects[2] ? `${equipmentTooltips[6].honingEffects[2].name} +${equipmentTooltips[6].honingEffects[2].value}` : ''}
                      </div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[7])}`}>
                      <img src={equipmentImages[7]} alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap">
                        {equipmentTooltips[7]?.stats[0] ? `힘/민첩/지능 +${equipmentTooltips[7].stats[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[7]?.honingEffects[0] ? `${equipmentTooltips[7].honingEffects[0].name} +${equipmentTooltips[7].honingEffects[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[7]?.honingEffects[1] ? `${equipmentTooltips[7].honingEffects[1].name} +${equipmentTooltips[7].honingEffects[1].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[7]?.honingEffects[2] ? `${equipmentTooltips[7].honingEffects[2].name} +${equipmentTooltips[7].honingEffects[2].value}` : ''}
                      </div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[8])}`}>
                      <img src={equipmentImages[8]} alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap">
                        {equipmentTooltips[8]?.stats[0] ? `힘/민첩/지능 +${equipmentTooltips[8].stats[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[8]?.honingEffects[0] ? `${equipmentTooltips[8].honingEffects[0].name} +${equipmentTooltips[8].honingEffects[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[8]?.honingEffects[1] ? `${equipmentTooltips[8].honingEffects[1].name} +${equipmentTooltips[8].honingEffects[1].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[8]?.honingEffects[2] ? `${equipmentTooltips[8].honingEffects[2].name} +${equipmentTooltips[8].honingEffects[2].value}` : ''}
                      </div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[9])}`}>
                      <img src={equipmentImages[9]} alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap">
                        {equipmentTooltips[9]?.stats[0] ? `힘/민첩/지능 +${equipmentTooltips[9].stats[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[9]?.honingEffects[0] ? `${equipmentTooltips[9].honingEffects[0].name} +${equipmentTooltips[9].honingEffects[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[9]?.honingEffects[1] ? `${equipmentTooltips[9].honingEffects[1].name} +${equipmentTooltips[9].honingEffects[1].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[9]?.honingEffects[2] ? `${equipmentTooltips[9].honingEffects[2].name} +${equipmentTooltips[9].honingEffects[2].value}` : ''}
                      </div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[10])}`}>
                      <img src={equipmentImages[10]} alt="" />
                      <span className="progress">0</span>
                    </div>
                    <div className="accessory-text-box">
                      <div className="grinding-wrap">
                        {equipmentTooltips[10]?.stats[0] ? `힘/민첩/지능 +${equipmentTooltips[10].stats[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[10]?.honingEffects[0] ? `${equipmentTooltips[10].honingEffects[0].name} +${equipmentTooltips[10].honingEffects[0].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[10]?.honingEffects[1] ? `${equipmentTooltips[10].honingEffects[1].name} +${equipmentTooltips[10].honingEffects[1].value}` : ''}
                      </div>
                      <div className="grinding-wrap">
                        {equipmentTooltips[10]?.honingEffects[2] ? `${equipmentTooltips[10].honingEffects[2].name} +${equipmentTooltips[10].honingEffects[2].value}` : ''}
                      </div>
                    </div>
                  </li>
                  <li className="accessory-item">
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[11])}`}>
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
                    <div className={`img-box radius skeleton ${getGradeClass(equipmentGrades[12])}`}>
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
