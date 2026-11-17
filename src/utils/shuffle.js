// Fisher-Yates 셔플. 원본 배열은 건드리지 않고 새 배열을 돌려준다.
export function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
