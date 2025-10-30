import fetch from "node-fetch"; // Vercel 환경에서 필요할 수 있음

export default async function handler(req, res) {
  try {
    // 1️⃣ Wikimedia Commons API에서 랜덤 이미지 10개 가져오기
    const response = await fetch(
      "https://commons.wikimedia.org/w/api.php?action=query&generator=random&grnnamespace=6&grnlimit=10&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*"
    );

    if (!response.ok) {
      console.error("🌐 외부 API 응답 오류:", response.status);
      return res.status(502).json({ error: "외부 API 요청 실패" });
    }

    const data = await response.json();

    if (!data.query) {
      console.warn("⚠️ 결과가 비어 있습니다:", data);
      return res.status(200).json([]); // 빈 배열 반환
    }

    // 2️⃣ 유효한 이미지만 필터링
    const allCandidates = Object.values(data.query.pages)
      .filter(page => page.imageinfo?.[0]?.url)
      .map(page => ({
        name: page.title.replace(/^File:/, "").replace(/\.[^/.]+$/, ""),
        hint: "세계 역사 또는 인물 관련 이미지",
        image: page.imageinfo[0].url
      }));

    // 3️⃣ 실제 접속 가능한 이미지만 확인
    const validCandidates = [];
    for (const person of allCandidates) {
      try {
        const headCheck = await fetch(person.image, { method: "HEAD" });
        if (headCheck.ok && headCheck.headers.get("content-type")?.startsWith("image")) {
          validCandidates.push(person);
        }
      } catch {
        // 실패한 URL은 무시
      }
    }

    // 4️⃣ 5개 랜덤 선택
    const selected = [];
    const temp = [...validCandidates];
    while (selected.length < 5 && temp.length > 0) {
      const randIndex = Math.floor(Math.random() * temp.length);
      selected.push(temp.splice(randIndex, 1)[0]);
    }

    // 5️⃣ 캐시 방지
    res.setHeader("Cache-Control", "no-store");

    // 6️⃣ 최종 결과 반환
    res.status(200).json(selected);

  } catch (error) {
    console.error("❌ 내부 서버 오류:", error);
    res.status(500).json({ error: "퀴즈 자동 생성 중 서버 오류 발생", details: error.message });
  }
}






