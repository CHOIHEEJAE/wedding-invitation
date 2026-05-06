/* ============================================================
   main.js - 모바일 청첩장 메인 스크립트
   ============================================================ */

/* ─────────────────────────────────────────
   설정값 (여기만 수정하면 됩니다)
───────────────────────────────────────── */
const CONFIG = {
  // 카카오 API
  kakaoAppKey: 'YOUR_KAKAO_JS_KEY',      // kakao developers에서 발급받은 JavaScript 키

  // 예식장 좌표 (카카오맵에서 확인)
  venue: {
    lat: 37.5665,                          // 위도 (예: 서울시청)
    lng: 126.9780,                         // 경도
    name: '예식장 이름',
    address: '서울시 OO구 OO로 OOO',
  },

  // 카카오맵 / 네이버지도 연결용
  kakaoMapUrl: 'https://place.map.kakao.com/YOUR_PLACE_ID',  // 카카오맵 장소 URL
  naverMapUrl: 'https://naver.me/YOUR_NAVER_MAP_ID',          // 네이버지도 단축 URL

  // 공유 메시지
  share: {
    title: '🎊 신랑이름 ♥ 신부이름 결혼합니다',
    description: '2025년 OO월 OO일 / OO시 OO분',
    imageUrl: 'https://CHOIHEEJAE.github.io/wedding-invitation/images/og-thumbnail.jpg',
    pageUrl: 'https://CHOIHEEJAE.github.io/wedding-invitation/',
  },
};

/* ─────────────────────────────────────────
   DOMContentLoaded
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initKakaoMap();
  initSwiper();
  initKakaoShare();
  initMapButtons();
  initAccountToggle();
  initCopyButtons();
  initLinkCopy();
});

/* ─────────────────────────────────────────
   1. 스크롤 등장 애니메이션
───────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // 한 번만 실행
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────
   2. 카카오맵 초기화
───────────────────────────────────────── */
function initKakaoMap() {
  // kakao SDK가 로드되지 않았거나 키가 설정 안 된 경우 스킵
  if (typeof kakao === 'undefined' || CONFIG.kakaoAppKey === 'YOUR_KAKAO_JS_KEY') {
    showMapPlaceholder();
    return;
  }

  const mapContainer = document.getElementById('kakao-map');
  if (!mapContainer) return;

  const options = {
    center: new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng),
    level: 4,
  };

  const map = new kakao.maps.Map(mapContainer, options);

  // 마커 추가
  const markerPosition = new kakao.maps.LatLng(CONFIG.venue.lat, CONFIG.venue.lng);
  const marker = new kakao.maps.Marker({ position: markerPosition });
  marker.setMap(map);

  // 인포윈도우 (말풍선)
  const infoWindow = new kakao.maps.InfoWindow({
    content: `<div style="padding:8px 12px; font-size:13px; white-space:nowrap; font-family:sans-serif;">${CONFIG.venue.name}</div>`,
  });
  infoWindow.open(map, marker);
}

function showMapPlaceholder() {
  const mapContainer = document.getElementById('kakao-map');
  if (!mapContainer) return;
  mapContainer.style.display = 'flex';
  mapContainer.style.alignItems = 'center';
  mapContainer.style.justifyContent = 'center';
  mapContainer.style.fontSize = '0.8rem';
  mapContainer.style.color = '#888';
  mapContainer.innerHTML = '<p>📍 카카오맵 API 키를 설정하면 지도가 표시됩니다</p>';
}

/* ─────────────────────────────────────────
   3. 지도 외부 링크 버튼
───────────────────────────────────────── */
function initMapButtons() {
  const kakaoBtn = document.getElementById('btn-kakao-navi');
  const naverBtn = document.getElementById('btn-naver-map');

  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', () => {
      window.open(CONFIG.kakaoMapUrl, '_blank');
    });
  }

  if (naverBtn) {
    naverBtn.addEventListener('click', () => {
      window.open(CONFIG.naverMapUrl, '_blank');
    });
  }
}

/* ─────────────────────────────────────────
   4. Swiper.js 갤러리
───────────────────────────────────────── */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.gallery-swiper', {
    loop: true,
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 12,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
  });
}

/* ─────────────────────────────────────────
   5. 카카오 공유
───────────────────────────────────────── */
function initKakaoShare() {
  const btn = document.getElementById('btn-kakao-share');
  if (!btn) return;

  // kakao SDK 초기화 (index.html의 SDK 스크립트 이후 실행)
  if (typeof Kakao !== 'undefined' && CONFIG.kakaoAppKey !== 'YOUR_KAKAO_JS_KEY') {
    if (!Kakao.isInitialized()) {
      Kakao.init(CONFIG.kakaoAppKey);
    }
  }

  btn.addEventListener('click', () => {
    if (typeof Kakao === 'undefined' || CONFIG.kakaoAppKey === 'YOUR_KAKAO_JS_KEY') {
      alert('카카오 API 키를 설정해주세요 (js/main.js의 CONFIG.kakaoAppKey)');
      return;
    }

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: CONFIG.share.title,
        description: CONFIG.share.description,
        imageUrl: CONFIG.share.imageUrl,
        link: {
          mobileWebUrl: CONFIG.share.pageUrl,
          webUrl: CONFIG.share.pageUrl,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: CONFIG.share.pageUrl,
            webUrl: CONFIG.share.pageUrl,
          },
        },
      ],
    });
  });
}

/* ─────────────────────────────────────────
   6. 계좌번호 토글
───────────────────────────────────────── */
function initAccountToggle() {
  const toggleButtons = document.querySelectorAll('.account__toggle');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const detail = document.getElementById(targetId);
      if (!detail) return;

      const isHidden = detail.classList.contains('hidden');
      detail.classList.toggle('hidden', !isHidden);
      btn.textContent = isHidden
        ? btn.textContent.replace('▾', '▴')
        : btn.textContent.replace('▴', '▾');
    });
  });
}

/* ─────────────────────────────────────────
   7. 계좌번호 복사
───────────────────────────────────────── */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.btn--copy');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = '✅ 복사됨';
        setTimeout(() => (btn.textContent = original), 2000);
      });
    });
  });
}

/* ─────────────────────────────────────────
   8. 링크 복사
───────────────────────────────────────── */
function initLinkCopy() {
  const btn = document.getElementById('btn-link-copy');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const url = CONFIG.share.pageUrl !== 'https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO/'
      ? CONFIG.share.pageUrl
      : window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      const original = btn.textContent;
      btn.textContent = '✅ 링크가 복사되었습니다';
      setTimeout(() => (btn.textContent = original), 2000);
    });
  });
}
