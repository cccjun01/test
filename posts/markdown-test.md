# 마크다운 전체 기능 테스트

**날짜:** 2026-06-24

파서가 지원하는 모든 마크다운 요소를 한 파일에서 확인합니다.

---

## 텍스트 스타일

**굵게** · *기울임* · ~~취소선~~ · **_굵고 기울임_**

인라인 `코드`는 이렇게 표시됩니다.

---

## 제목 단계

### H3 제목
#### H4 제목
##### H5 제목
###### H6 제목

---

## 목록

### 순서 없는 목록
- 사과
- 바나나
- 체리
  - 중첩 항목 (들여쓰기)

### 순서 있는 목록
1. 첫 번째
2. 두 번째
3. 세 번째

---

## 링크와 이미지

[GitHub 바로가기](https://github.com)

![샘플 이미지](https://via.placeholder.com/600x200?text=Sample+Image)

---

## 인용구

> 단순함은 궁극의 세련됨이다.
> — 레오나르도 다 빈치

---

## 코드 블록

### JavaScript
```javascript
async function fetchPost(slug) {
  const res = await fetch(`posts/${slug}.md`);
  if (!res.ok) throw new Error('Not found');
  return res.text();
}
```

### HTML
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <title>My Blog</title>
  </head>
</html>
```

### CSS
```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e2e8f0;
}
```

---

## 표

| 언어       | 용도       | 난이도 |
|------------|------------|--------|
| HTML       | 구조       | 쉬움   |
| CSS        | 스타일     | 보통   |
| JavaScript | 동작       | 어려움 |
| TypeScript | 타입 안전  | 어려움 |

---

## 수평선

위 내용과 아래 내용을 구분합니다.

---

## 줄 바꿈

첫 번째 줄입니다.  
두 줄 공백으로 줄 바꿈합니다.  
세 번째 줄입니다.

---

이 파일로 파서의 모든 기능을 점검할 수 있습니다.
