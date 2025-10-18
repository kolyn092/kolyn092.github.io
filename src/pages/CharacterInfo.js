import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../hooks/useHttp';
import { useSearchParams } from 'react-router-dom';

// 로스트아크 캐릭터 정보 조회 페이지
const CharacterInfo = React.memo(function CharacterInfo() {
  const { loading, error, get } = useHttp();
  const [searchParams] = useSearchParams();
  const [characterName, setCharacterName] = useState('');
  const [characterData, setCharacterData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 캐릭터 검색
  const handleSearch = useCallback(async (searchName = null) => {
    const nameToSearch = searchName || characterName;
    
    // 타입 체크 및 문자열 변환
    if (!nameToSearch || typeof nameToSearch !== 'string') {
      console.error('❌ 잘못된 캐릭터명 타입:', typeof nameToSearch, nameToSearch);
      return;
    }
    
    const trimmedName = nameToSearch.trim();
    if (!trimmedName) {
      console.log('⚠️ 빈 캐릭터명');
      return;
    }

    try {
      console.log(`🔍 캐릭터 검색 시작: ${trimmedName}`);
      
      const data = await get(`/armories/characters/${encodeURIComponent(trimmedName)}`);
      
      // 응답 데이터 로깅
      console.log('📊 응답 데이터:', data);
      console.log('📈 응답 타입:', typeof data);
      console.log('📋 응답 구조:', Object.keys(data || {}));
      
      setCharacterData(data);
      
      // 검색 기록에 추가
      const newHistory = [trimmedName, ...searchHistory.filter(name => name !== trimmedName)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('characterSearchHistory', JSON.stringify(newHistory));
      
      console.log('✅ 캐릭터 검색 성공');
    } catch (err) {
      console.error('❌ 캐릭터 검색 실패:', err);
      console.error('🚨 에러 메시지:', err.message);
      console.error('🔢 에러 코드:', err.status || 'Unknown');
      console.error('📝 에러 스택:', err.stack);
    }
  }, [characterName, searchHistory, get]);

  // URL 파라미터에서 캐릭터명 가져오기 및 자동 검색 (한 번만)
  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    if (nameFromUrl && typeof nameFromUrl === 'string' && nameFromUrl.trim() && !hasSearched) {
      const trimmedName = nameFromUrl.trim();
      setCharacterName(trimmedName);
      setHasSearched(true); // 검색 플래그 설정
      
      // 직접 검색 실행 (handleSearch 의존성 없이)
      const performSearch = async () => {
        try {
          console.log(`🔍 캐릭터 검색 시작: ${trimmedName}`);
          
          const data = await get(`/armories/characters/${encodeURIComponent(trimmedName)}`);
          
          // 응답 데이터 로깅
          console.log('📊 응답 데이터:', data);
          console.log('📈 응답 타입:', typeof data);
          console.log('📋 응답 구조:', Object.keys(data || {}));
          
          setCharacterData(data);
          
          // 검색 기록에 추가
          const newHistory = [trimmedName, ...searchHistory.filter(name => name !== trimmedName)].slice(0, 10);
          setSearchHistory(newHistory);
          localStorage.setItem('characterSearchHistory', JSON.stringify(newHistory));
          
          console.log('✅ 캐릭터 검색 성공');
        } catch (err) {
          console.error('❌ 캐릭터 검색 실패:', err);
          console.error('🚨 에러 메시지:', err.message);
          console.error('🔢 에러 코드:', err.status || 'Unknown');
          console.error('📝 에러 스택:', err.stack);
        }
      };
      
      performSearch();
    }
  }, [searchParams, get, hasSearched]); // hasSearched 의존성 추가

  // 로컬 스토리지에서 검색 기록 불러오기
  useEffect(() => {
    const history = localStorage.getItem('characterSearchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 검색 기록에서 선택
  const handleHistorySelect = (name) => {
    setCharacterName(name);
  };

  // 검색 기록 삭제
  const handleHistoryDelete = (name) => {
    const newHistory = searchHistory.filter(item => item !== name);
    setSearchHistory(newHistory);
    localStorage.setItem('characterSearchHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="character-info-page">
      <div className="character-header">
        <h1>로스트아크 캐릭터 정보</h1>
        <p className="character-subtitle">캐릭터명을 입력하여 상세 정보를 조회하세요</p>
      </div>

      {/* 검색 섹션 */}
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="캐릭터명을 입력하세요"
            className="character-search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !characterName.trim()}
            className="search-button"
          >
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>

        {/* 검색 기록 */}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <h3>최근 검색</h3>
            <div className="history-tags">
              {searchHistory.map((name, index) => (
                <div key={index} className="history-tag">
                  <span onClick={() => handleHistorySelect(name)} className="history-name">
                    {name}
                  </span>
                  <button
                    onClick={() => handleHistoryDelete(name)}
                    className="history-delete"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="error-message">
          <h3>검색 오류</h3>
          <p>{error}</p>
        </div>
      )}

      {/* 캐릭터 정보 표시 */}
      {characterData && (
        <div className="character-details">
          {/* 기본 정보 */}
          <div className="character-basic-info">
            <div className="character-avatar">
              <img 
                src={characterData.CharacterImage || '/default-avatar.png'} 
                alt={characterData.CharacterName}
                className="avatar-image"
              />
            </div>
            <div className="character-info">
              <h2 className="character-name">{characterData.CharacterName}</h2>
              <div className="character-level">
                <span className="level-label">레벨</span>
                <span className="level-value">{characterData.CharacterLevel}</span>
              </div>
              <div className="character-class">
                <span className="class-label">직업</span>
                <span className="class-value">{characterData.CharacterClassName}</span>
              </div>
            </div>
          </div>

          {/* 장비 정보 */}
          {characterData.ArmoryProfile && (
            <div className="equipment-section">
              <h3>장비 정보</h3>
              <div className="equipment-grid">
                {characterData.ArmoryProfile.Equipment && characterData.ArmoryProfile.Equipment.map((item, index) => (
                  <div key={index} className="equipment-item">
                    <div className="item-icon">
                      <img src={item.Icon} alt={item.Name} />
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.Name}</div>
                      <div className="item-grade">{item.Grade}</div>
                      <div className="item-level">+{item.Level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 각인 정보 */}
          {characterData.ArmoryProfile && characterData.ArmoryProfile.Engravings && (
            <div className="engraving-section">
              <h3>각인</h3>
              <div className="engraving-list">
                {characterData.ArmoryProfile.Engravings.map((engraving, index) => (
                  <div key={index} className="engraving-item">
                    <span className="engraving-name">{engraving.Name}</span>
                    <span className="engraving-level">Lv.{engraving.Level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 보석 정보 */}
          {characterData.ArmoryProfile && characterData.ArmoryProfile.Gems && (
            <div className="gem-section">
              <h3>보석</h3>
              <div className="gem-grid">
                {characterData.ArmoryProfile.Gems.map((gem, index) => (
                  <div key={index} className="gem-item">
                    <div className="gem-icon">
                      <img src={gem.Icon} alt={gem.Name} />
                    </div>
                    <div className="gem-info">
                      <div className="gem-name">{gem.Name}</div>
                      <div className="gem-level">Lv.{gem.Level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 스킬 정보 */}
          {characterData.ArmoryProfile && characterData.ArmoryProfile.Skills && (
            <div className="skill-section">
              <h3>스킬</h3>
              <div className="skill-grid">
                {characterData.ArmoryProfile.Skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-icon">
                      <img src={skill.Icon} alt={skill.Name} />
                    </div>
                    <div className="skill-info">
                      <div className="skill-name">{skill.Name}</div>
                      <div className="skill-level">Lv.{skill.Level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>캐릭터 정보를 불러오는 중...</p>
        </div>
      )}
    </div>
  );
});

export default CharacterInfo;
