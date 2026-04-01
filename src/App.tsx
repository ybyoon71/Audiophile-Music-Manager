import React, { useState, useMemo } from 'react';
import { Search, Play, Disc3, Speaker, Music, Mic2, Headphones, Trash2, Plus, Loader2, X } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

type Category = 'System Reference' | 'Classic' | 'Pop' | 'Vocal';

interface Song {
  id: number;
  title: string;
  artist: string;
  category: Category;
  subCategory: string;
  isSystemReference: boolean;
  review: string;
  listeningPoint: string;
  youtubeId: string;
}

const MUSIC_DATA: Song[] = [
  // Classic (10)
  {
    id: 1,
    title: "Symphony No. 2 in C minor 'Resurrection'",
    artist: "Gustav Mahler (Cond. Claudio Abbado)",
    category: "Classic",
    subCategory: "Symphony",
    isSystemReference: true,
    review: "마크레빈슨 No.336L의 압도적인 댐핑 능력과 전원 공급 능력을 시험할 수 있는 대편성 곡입니다. 피날레의 폭발적인 총주에서 아카펠라 비올론의 우퍼가 얼마나 정확하게 제어되는지, 그리고 MBL 6010D가 그려내는 광활한 사운드 스테이지를 경험해보세요.",
    listeningPoint: "5악장 피날레의 금관악기와 합창단의 다이내믹 레인지",
    youtubeId: "4MpZpW9KWvw"
  },
  {
    id: 2,
    title: "Violin Concerto in D Major, Op. 35",
    artist: "P.I. Tchaikovsky (Violin. Anne-Sophie Mutter)",
    category: "Classic",
    subCategory: "Concerto",
    isSystemReference: true,
    review: "아카펠라 비올론 2001의 이온 트위터가 지닌 진가를 확인할 수 있는 곡입니다. 무터의 날카로우면서도 섬세한 보잉이 이온 트위터 특유의 질감과 해상력으로 피어오르며, 허공에 흩뿌려지는 배음의 아름다움을 만끽할 수 있습니다.",
    listeningPoint: "1악장 카덴차 부분의 미세한 현의 떨림과 배음",
    youtubeId: "CTE08Ez0NCY"
  },
  {
    id: 3,
    title: "Cello Suite No. 1 in G Major",
    artist: "J.S. Bach (Cello. Janos Starker)",
    category: "Classic",
    subCategory: "Solo",
    isSystemReference: true,
    review: "첼로의 묵직한 통울림과 현의 마찰음을 사실적으로 전달합니다. 아카펠라 비올론의 혼 미드레인지가 첼로 바디의 깊은 울림을 얼마나 밀도 있게 표현하는지 확인해보세요.",
    listeningPoint: "첼로의 깊은 저음과 활이 현에 닿는 순간의 거친 질감",
    youtubeId: "mGQLXRTl3Z0"
  },
  {
    id: 4,
    title: "Nocturne Op. 9 No. 2",
    artist: "Frederic Chopin (Piano. Arthur Rubinstein)",
    category: "Classic",
    subCategory: "Solo",
    isSystemReference: true,
    review: "피아노의 맑고 투명한 타건음과 서정적인 멜로디를 감상할 수 있습니다. MBL 6010D 프리앰프가 피아노의 배음을 공간에 어떻게 흩뿌리는지 감상하는 것이 포인트입니다.",
    listeningPoint: "루빈스타인의 우아한 터치와 허공으로 사라지는 피아노 배음",
    youtubeId: "YGRO05WcNDk"
  },
  {
    id: 5,
    title: "String Quartet No. 14 'Death and the Maiden'",
    artist: "Franz Schubert (Quartetto Italiano)",
    category: "Classic",
    subCategory: "Chamber",
    isSystemReference: true,
    review: "네 대의 현악기가 빚어내는 치열한 앙상블입니다. 이온 트위터의 초고역 재생 능력이 바이올린의 날카로운 어택을 자극 없이 투명하게 재생해냅니다.",
    listeningPoint: "각 악기의 명확한 위치(정위감)와 현이 교차할 때의 마찰음",
    youtubeId: "XoZJvE3_u1I"
  },
  {
    id: 6,
    title: "Requiem in D minor, K. 626 - Dies Irae",
    artist: "W.A. Mozart (Cond. Karl Böhm)",
    category: "Classic",
    subCategory: "Religious",
    isSystemReference: true,
    review: "합창과 오케스트라가 뿜어내는 압도적인 에너지를 마크레빈슨 336L이 어떻게 통제하는지 보여줍니다. 복잡한 총주 속에서도 각 성부의 분리도가 유지되어야 합니다.",
    listeningPoint: "도입부의 폭발적인 팀파니 타격과 4성부 합창의 분리도",
    youtubeId: "RKzEwK8yvGk"
  },
  {
    id: 7,
    title: "The Rite of Spring",
    artist: "Igor Stravinsky (Cond. Pierre Boulez)",
    category: "Classic",
    subCategory: "Contemporary",
    isSystemReference: true,
    review: "복잡한 리듬과 극단적인 다이내믹스가 특징인 현대음악의 레퍼런스입니다. 시스템의 과도 응답 특성(Transient Response)과 대편성에서의 스피드를 극한으로 테스트합니다.",
    listeningPoint: "불규칙하게 터져 나오는 오케스트라 튜티의 타격감과 잔향",
    youtubeId: "FFPjFjUonX8"
  },
  {
    id: 8,
    title: "Symphony No. 9 in D minor 'Choral'",
    artist: "L.v. Beethoven (Cond. Herbert von Karajan)",
    category: "Classic",
    subCategory: "Symphony",
    isSystemReference: true,
    review: "MBL 6010D의 광활한 사운드 스테이지를 경험할 수 있는 최고의 트랙입니다. 무대 깊숙한 곳에서 울려 퍼지는 합창단의 위치와 오케스트라의 전후좌우 레이어링을 확인하세요.",
    listeningPoint: "4악장 '환희의 송가' 합창 파트의 거대한 무대 크기와 깊이감",
    youtubeId: "ixpfgkdPK90"
  },
  {
    id: 9,
    title: "Piano Concerto No. 2 in C minor",
    artist: "Sergei Rachmaninoff (Piano. Krystian Zimerman)",
    category: "Classic",
    subCategory: "Concerto",
    isSystemReference: true,
    review: "피아노의 육중한 타건과 오케스트라의 웅장한 반주가 어우러집니다. 마크레빈슨의 구동력이 피아노의 저음역대를 얼마나 권위 있게 밀어주는지 감상해보세요.",
    listeningPoint: "1악장 도입부 피아노 화음의 무게감과 오케스트라가 밀려오는 순간",
    youtubeId: "rEGOihjqO9w"
  },
  {
    id: 10,
    title: "24 Caprices for Solo Violin, Op. 1",
    artist: "Niccolò Paganini (Violin. Michael Rabin)",
    category: "Classic",
    subCategory: "Solo",
    isSystemReference: true,
    review: "바이올린의 극한 기교를 보여주는 곡으로, 이온 트위터의 진가를 가장 잘 드러냅니다. 초고역으로 치닫는 배음이 찌그러짐 없이 맑고 투명하게 뻗어나가야 합니다.",
    listeningPoint: "초고역대에서의 현의 떨림과 활이 현을 튕기는 순간의 속도감",
    youtubeId: "PZ307sM0t-0"
  },

  // Pop & Rock (10)
  {
    id: 11,
    title: "Keith Don't Go (Live)",
    artist: "Nils Lofgren",
    category: "Pop",
    subCategory: "Rock",
    isSystemReference: true,
    review: "어쿠스틱 기타의 텐션과 타격감을 테스트하기에 완벽한 트랙입니다. MBL 6010D 프리앰프의 투명함이 기타 줄의 튕김을 눈앞에서 보는 듯한 실체감을 주며, 마크레빈슨의 순발력이 기타 바디의 울림을 단단하게 잡아줍니다.",
    listeningPoint: "초반부 어쿠스틱 기타의 날카로운 어택과 공간을 채우는 잔향",
    youtubeId: "tKW4L1g81W0"
  },
  {
    id: 12,
    title: "You Look Good To Me",
    artist: "The Oscar Peterson Trio",
    category: "Pop",
    subCategory: "Jazz",
    isSystemReference: true,
    review: "우측의 콘트라베이스 보잉과 좌측의 드럼 브러쉬 사운드를 통해 시스템의 정위감과 해상력을 평가할 수 있습니다. 특히 콘트라베이스의 깊게 떨어지는 저역을 마크레빈슨 336L이 얼마나 윤곽을 잃지 않고 구동하는지가 포인트입니다.",
    listeningPoint: "도입부 콘트라베이스의 깊은 울림과 드럼 브러쉬의 미세한 질감",
    youtubeId: "1p_BVa1XqZ0"
  },
  {
    id: 13,
    title: "Hotel California (Live on MTV, 1994)",
    artist: "Eagles",
    category: "Pop",
    subCategory: "Rock",
    isSystemReference: true,
    review: "라이브 공연의 현장감과 어쿠스틱 기타의 찰랑거림이 일품입니다. 아카펠라 스피커가 라이브 홀의 열기와 관객의 환호성을 얼마나 입체적으로 재현하는지 확인하세요.",
    listeningPoint: "도입부 기타 솔로의 선명함과 콩가 드럼의 묵직한 타격감",
    youtubeId: "EqPtz5qN7HM"
  },
  {
    id: 14,
    title: "Thriller",
    artist: "Michael Jackson",
    category: "Pop",
    subCategory: "Pop",
    isSystemReference: true,
    review: "다양한 효과음과 신디사이저, 그리고 강력한 비트가 어우러진 팝의 명곡입니다. 마크레빈슨 336L의 다이내믹스와 리듬감, 그리고 저역의 펀치력을 테스트하기 좋습니다.",
    listeningPoint: "초반부 문 닫히는 소리의 공간감과 묵직하게 떨어지는 신스 베이스 라인",
    youtubeId: "sOnqjkJTMaA"
  },
  {
    id: 15,
    title: "Time",
    artist: "Pink Floyd",
    category: "Pop",
    subCategory: "Rock",
    isSystemReference: true,
    review: "초반부의 시계 소리들은 시스템의 해상력과 채널 분리도를 극한으로 테스트합니다. MBL 6010D의 정교한 이미징 능력이 수많은 시계들의 위치를 정확히 짚어냅니다.",
    listeningPoint: "도입부 수많은 시계들의 알람 소리와 로토탐 드럼의 좌우 이동",
    youtubeId: "rL3AgkwbYgo"
  },
  {
    id: 16,
    title: "Tin Pan Alley",
    artist: "Stevie Ray Vaughan",
    category: "Pop",
    subCategory: "Blues",
    isSystemReference: true,
    review: "일렉트릭 기타의 강렬한 트랜지언트와 끈적한 블루스 리듬이 돋보입니다. 앰프의 순간적인 전류 공급 능력이 기타의 피크 음을 얼마나 여유 있게 처리하는지 보여줍니다.",
    listeningPoint: "기타 줄을 강하게 뜯을 때의 파열음과 묵직한 베이스의 리듬감",
    youtubeId: "f_J5rBxeTIk"
  },
  {
    id: 17,
    title: "Blinding Lights",
    artist: "The Weeknd",
    category: "Pop",
    subCategory: "R&B",
    isSystemReference: true,
    review: "현대 팝의 꽉 찬 마스터링과 신디사이저의 질감을 테스트합니다. 마크레빈슨 336L이 쉴 새 없이 몰아치는 일렉트로닉 베이스를 얼마나 단단하게 통제하는지가 관건입니다.",
    listeningPoint: "곡 전체를 주도하는 신스 베이스의 타격감과 보컬의 선명도",
    youtubeId: "4NRXx6U8ABQ"
  },
  {
    id: 18,
    title: "The Next Episode",
    artist: "Dr. Dre ft. Snoop Dogg",
    category: "Pop",
    subCategory: "Hip-hop",
    isSystemReference: true,
    review: "힙합 특유의 초저역 서브베이스와 날카로운 하이햇의 대비를 보여줍니다. 아카펠라 비올론의 우퍼가 바닥을 흔드는 저역을 뭉개짐 없이 재생해내야 합니다.",
    listeningPoint: "도입부의 서브베이스 펀치력과 스눕독 보컬의 딕션",
    youtubeId: "QZXc39hT8t4"
  },
  {
    id: 19,
    title: "Tennessee Whiskey",
    artist: "Chris Stapleton",
    category: "Pop",
    subCategory: "Country",
    isSystemReference: true,
    review: "어쿠스틱한 밴드 사운드와 거친 보컬의 질감이 매력적입니다. 혼 미드레인지가 크리스 스태플턴의 두터운 목소리를 얼마나 호소력 있게 전달하는지 감상해보세요.",
    listeningPoint: "보컬의 긁는 듯한 질감과 따뜻한 일렉트릭 기타 톤",
    youtubeId: "4zAThXFOy2c"
  },
  {
    id: 20,
    title: "Get Lucky",
    artist: "Daft Punk ft. Pharrell Williams",
    category: "Pop",
    subCategory: "Disco",
    isSystemReference: true,
    review: "완벽하게 마스터링된 디스코 리듬으로 시스템의 PRaT(Pace, Rhythm and Timing)를 평가합니다. 베이스와 드럼의 리듬이 한 치의 오차 없이 딱딱 맞아떨어져야 합니다.",
    listeningPoint: "나일 로저스의 펑키한 기타 커팅과 쫄깃한 베이스 라인",
    youtubeId: "5NV6Rdv1a3I"
  },

  // Vocal (10)
  {
    id: 21,
    title: "Way Down Deep",
    artist: "Jennifer Warnes",
    category: "Vocal",
    subCategory: "Female",
    isSystemReference: true,
    review: "초저역의 타악기 소리와 제니퍼 워너스의 보컬이 어우러지는 곡입니다. 아카펠라 비올론의 혼 미드레인지가 보컬의 밀도감을 어떻게 표현하는지, 그리고 바닥을 울리는 저역 타격감을 시스템이 어떻게 통제하는지 확인해보세요.",
    listeningPoint: "일정한 간격으로 떨어지는 초저역 북소리의 텐션과 보컬의 분리도",
    youtubeId: "wO0A0XcWy88"
  },
  {
    id: 22,
    title: "Cantate Domino",
    artist: "Oscars Motettkör",
    category: "Vocal",
    subCategory: "Choir",
    isSystemReference: true,
    review: "성당의 거대한 공간감과 파이프 오르간, 합창단의 조화를 통해 MBL 6010D의 공간 창출 능력을 엿볼 수 있습니다. 이온 트위터는 합창단원 개개인의 목소리가 섞이지 않고 천장으로 뻗어나가는 공기감을 환상적으로 재현합니다.",
    listeningPoint: "파이프 오르간의 초저역과 합창이 어우러질 때의 홀 톤(Hall Tone)",
    youtubeId: "l8J8_I03O20"
  },
  {
    id: 23,
    title: "Come Away With Me",
    artist: "Norah Jones",
    category: "Vocal",
    subCategory: "Female",
    isSystemReference: true,
    review: "따뜻하고 편안한 보컬과 피아노 사운드가 돋보이는 곡입니다. 혼 미드레인지 특유의 온기감과 밀도감이 노라 존스의 목소리를 바로 귀 옆에서 부르는 듯한 착각을 일으킵니다.",
    listeningPoint: "노라 존스의 매끄러운 보컬 톤과 입술이 떨어지는 미세한 소리",
    youtubeId: "lbjZPFBD6JU"
  },
  {
    id: 24,
    title: "Liquid Spirit",
    artist: "Gregory Porter",
    category: "Vocal",
    subCategory: "Male",
    isSystemReference: true,
    review: "남성 바리톤 보컬의 두께감과 에너지를 테스트합니다. 마크레빈슨 336L이 밀어주는 힘찬 보컬과 박수 소리의 경쾌한 트랜지언트가 일품입니다.",
    listeningPoint: "그레고리 포터의 묵직한 목소리와 배경의 박수 소리의 입체감",
    youtubeId: "cO2Hh5ZzXQk"
  },
  {
    id: 25,
    title: "Con Te Partiro",
    artist: "Andrea Bocelli",
    category: "Vocal",
    subCategory: "Male",
    isSystemReference: true,
    review: "테너 보컬의 뻗어나가는 힘과 오케스트라의 웅장함을 동시에 감상할 수 있습니다. 클라이맥스에서 보컬이 오케스트라를 뚫고 나오는 쾌감을 느껴보세요.",
    listeningPoint: "후반부 고음역대에서의 보컬 에너지와 오케스트라의 스케일",
    youtubeId: "tcrfvP11Hgl"
  },
  {
    id: 26,
    title: "Time to Say Goodbye",
    artist: "Andrea Bocelli & Sarah Brightman",
    category: "Vocal",
    subCategory: "Duet",
    isSystemReference: true,
    review: "남녀 보컬의 하모니와 음색 대비를 평가하기 좋은 듀엣곡입니다. MBL 6010D의 해상력이 두 가수의 목소리가 섞이지 않고 각자의 위치에서 명확하게 발음되도록 돕습니다.",
    listeningPoint: "두 가수가 화음을 맞출 때의 음색 분리도와 무대 중앙의 포커싱",
    youtubeId: "4L_yCwFD6Jo"
  },
  {
    id: 27,
    title: "And So It Goes",
    artist: "The King's Singers",
    category: "Vocal",
    subCategory: "A Cappella",
    isSystemReference: true,
    review: "악기 없이 오직 목소리로만 이루어진 아카펠라 곡입니다. 6명의 남성 보컬이 무대 위에 서 있는 위치를 눈으로 그리듯 정확하게 핀포인트 이미징을 만들어내야 합니다.",
    listeningPoint: "각 성부(카운터테너부터 베이스까지)의 명확한 위치와 화음의 조화",
    youtubeId: "1qjA5u2H_qA"
  },
  {
    id: 28,
    title: "Temptation",
    artist: "Diana Krall",
    category: "Vocal",
    subCategory: "Female",
    isSystemReference: true,
    review: "치찰음(Sibilance) 제어 능력을 확인하기 좋은 트랙입니다. 이온 트위터는 다이애나 크롤의 거친 듯한 보컬을 자극 없이 매끄럽게, 그러면서도 극도의 해상력으로 재생합니다.",
    listeningPoint: "보컬의 'ㅅ', 'ㅊ' 발음에서의 자극 유무와 콘트라베이스의 탄력",
    youtubeId: "8bO4x-eR8-A"
  },
  {
    id: 29,
    title: "A Thousand Kisses Deep",
    artist: "Leonard Cohen",
    category: "Vocal",
    subCategory: "Male",
    isSystemReference: true,
    review: "초저역으로 내려가는 레너드 코엔의 읊조리는 듯한 보컬입니다. 시스템이 저음역대의 해상력을 잃지 않으면서 보컬의 흉성(Chest voice)을 얼마나 깊이 있게 표현하는지 테스트합니다.",
    listeningPoint: "바닥으로 깔리는 보컬의 무게감과 미세한 숨소리",
    youtubeId: "K1J18y6K9X0"
  },
  {
    id: 30,
    title: "Requiem: Pie Jesu",
    artist: "John Rutter (Cond. John Rutter)",
    category: "Vocal",
    subCategory: "Choir",
    isSystemReference: true,
    review: "소프라노 독창과 합창단, 그리고 거대한 파이프 오르간이 어우러집니다. 이온 트위터가 만들어내는 성당의 공기감(Airiness)과 소프라노의 천상의 목소리를 경험할 수 있습니다.",
    listeningPoint: "소프라노 솔로의 맑은 고음과 무대 뒤편에서 밀려오는 오르간의 초저역",
    youtubeId: "c_Xp4B_450g"
  }
];

export default function App() {
  const [songs, setSongs] = useState<Song[]>(MUSIC_DATA);
  const [activeCategory, setActiveCategory] = useState<Category>('System Reference');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newSongQuery, setNewSongQuery] = useState('');
  const [generatedSong, setGeneratedSong] = useState<Partial<Song> | null>(null);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesCategory = activeCategory === 'System Reference' 
        ? song.isSystemReference 
        : song.category === activeCategory;
      
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handlePlay = (youtubeId: string, title: string, artist: string) => {
    // In a real app, this might open a modal with an embedded player.
    // For this demo, we'll open the YouTube search/video in a new tab.
    const query = encodeURIComponent(`${title} ${artist}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const handleDelete = (id: number) => {
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  const handleGenerate = async () => {
    if (!newSongQuery) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Generate an audiophile system review for the song/music: "${newSongQuery}".
        The review MUST focus on how this specific track demonstrates the capabilities of this exact high-end audio system:
        - Preamp: MBL 6010D
        - Power Amp: Mark Levinson No.336L
        - Speakers: Acapella Violon 2001 (features an ion tweeter and horn midrange)
        
        Return the result in JSON format matching the schema.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              category: { type: Type.STRING, description: "Must be exactly 'Classic', 'Pop', or 'Vocal'" },
              subCategory: { type: Type.STRING },
              review: { type: Type.STRING, description: "Korean language. Professional audiophile review focusing on the specified system." },
              listeningPoint: { type: Type.STRING, description: "Korean language. Specific sonic elements to listen for." },
              youtubeId: { type: Type.STRING, description: "11-character YouTube video ID, or a good search keyword" }
            },
            required: ["title", "artist", "category", "subCategory", "review", "listeningPoint", "youtubeId"]
          }
        }
      });
      
      if (response.text) {
        const data = JSON.parse(response.text);
        if (!['Classic', 'Pop', 'Vocal'].includes(data.category)) {
          data.category = 'Pop';
        }
        setGeneratedSong({
          ...data,
          isSystemReference: true,
          id: Date.now()
        });
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSong = () => {
    if (generatedSong) {
      setSongs(prev => [generatedSong as Song, ...prev]);
      setGeneratedSong(null);
      setNewSongQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-10">
        <div className="p-8 border-b border-white/10">
          <h1 className="font-serif text-3xl font-light tracking-wider text-[#d4af37] mb-2">
            AUDIOPHILE
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
            Music Manager
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            <li>
              <button
                onClick={() => setActiveCategory('System Reference')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                  activeCategory === 'System Reference' 
                    ? 'bg-white/10 text-[#d4af37]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Speaker size={18} className={activeCategory === 'System Reference' ? 'text-[#d4af37]' : ''} />
                <span className="text-xs uppercase tracking-widest font-medium">System Reference</span>
              </button>
            </li>
            <li className="pt-4 pb-2 px-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Library</span>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('Classic')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                  activeCategory === 'Classic' 
                    ? 'bg-white/10 text-[#d4af37]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Music size={18} />
                <span className="text-xs uppercase tracking-widest font-medium">Classic</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('Pop')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                  activeCategory === 'Pop' 
                    ? 'bg-white/10 text-[#d4af37]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Disc3 size={18} />
                <span className="text-xs uppercase tracking-widest font-medium">Pop & Rock</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('Vocal')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                  activeCategory === 'Vocal' 
                    ? 'bg-white/10 text-[#d4af37]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mic2 size={18} />
                <span className="text-xs uppercase tracking-widest font-medium">Vocal</span>
              </button>
            </li>
          </ul>

          <div className="px-4 mt-8 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 block mb-3">Add New Reference</span>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search song to add..."
                value={newSongQuery}
                onChange={(e) => setNewSongQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !newSongQuery}
                className="w-full bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 rounded-lg py-2 text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {isGenerating ? 'Generating...' : 'Generate Review'}
              </button>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-white/40">
            <Headphones size={16} />
            <div className="text-[10px] uppercase tracking-wider">
              <p>MBL 6010D</p>
              <p>Mark Levinson 336L</p>
              <p>Acapella Violon 2001</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0f0f0f]">
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="font-serif text-2xl text-white">
              {activeCategory} <span className="italic-small text-white/50 ml-2">Collection</span>
            </h2>
            {activeCategory === 'System Reference' && (
              <p className="text-xs text-[#d4af37]/80 mt-2 max-w-xl leading-relaxed">
                Curated tracks specifically selected to demonstrate the extreme capabilities of the MBL, Mark Levinson, and Acapella system.
              </p>
            )}
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/10 transition-all"
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {filteredSongs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/40">
              <Disc3 size={48} className="mb-4 opacity-20" />
              <p className="text-sm tracking-widest uppercase">No tracks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredSongs.map((song) => (
                <article 
                  key={song.id} 
                  className="group relative bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#d4af37]/30 transition-all duration-500 flex flex-col h-full overflow-hidden"
                >
                  {/* Background Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <button 
                    onClick={() => handleDelete(song.id)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors z-20 opacity-0 group-hover:opacity-100"
                    aria-label="Delete song"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex justify-between items-start mb-4 relative z-10 pr-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-white/10 text-white/60">
                          {song.category}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#d4af37]/80">
                          {song.subCategory}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-white mb-1 group-hover:text-[#d4af37] transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-xs text-white/50 tracking-wide">
                        {song.artist}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handlePlay(song.youtubeId, song.title, song.artist)}
                      className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all shrink-0 group/btn"
                      aria-label={`Play ${song.title}`}
                    >
                      <Play size={18} className="ml-1 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>

                  <div className="mt-auto pt-6 space-y-4 relative z-10">
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                        <Speaker size={12} />
                        System Review
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed font-light">
                        {song.review}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 px-2">
                      <div className="w-1 h-1 rounded-full bg-[#d4af37] mt-2 shrink-0" />
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-[#d4af37] mb-1">
                          Listening Point
                        </h4>
                        <p className="text-xs text-white/60 italic">
                          "{song.listeningPoint}"
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Song Modal */}
      {generatedSong && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl text-[#d4af37]">Review Generated</h3>
              <button onClick={() => setGeneratedSong(null)} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Title</label>
                  <input type="text" value={generatedSong.title || ''} onChange={e => setGeneratedSong({...generatedSong, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Artist</label>
                  <input type="text" value={generatedSong.artist || ''} onChange={e => setGeneratedSong({...generatedSong, artist: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Category</label>
                  <select value={generatedSong.category || 'Pop'} onChange={e => setGeneratedSong({...generatedSong, category: e.target.value as Category})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50">
                    <option value="Classic">Classic</option>
                    <option value="Pop">Pop & Rock</option>
                    <option value="Vocal">Vocal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Sub Category</label>
                  <input type="text" value={generatedSong.subCategory || ''} onChange={e => setGeneratedSong({...generatedSong, subCategory: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">System Review</label>
                <textarea value={generatedSong.review || ''} onChange={e => setGeneratedSong({...generatedSong, review: e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white leading-relaxed focus:outline-none focus:border-[#d4af37]/50" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Listening Point</label>
                <input type="text" value={generatedSong.listeningPoint || ''} onChange={e => setGeneratedSong({...generatedSong, listeningPoint: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50" />
              </div>
              
              <button onClick={handleAddSong} className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-medium rounded-lg py-3 mt-6 transition-colors uppercase tracking-widest text-sm">
                Add to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
