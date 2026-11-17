import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 같은 와이파이의 스마트폰으로 접속해서 터치 테스트를 할 수 있도록 네트워크 주소도 연다.
    host: true,
  },
});
