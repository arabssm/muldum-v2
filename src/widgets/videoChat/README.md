# Video Chat Widget

WebRTC 기반 비디오 채팅 위젯입니다.

## 기능

- 실시간 비디오/오디오 통화
- 화면 공유
- 텍스트 채팅
- 참가자 목록
- 방 생성/참가/나가기

## API 연동

이 컴포넌트는 다음 API 서버와 연동됩니다:
- REST API: `http://localhost:8001`
- WebSocket: `ws://localhost:8001/ws/signal`

### 주요 API 엔드포인트

1. **방 생성**: `POST /rooms`
2. **방 목록**: `GET /sup/rooms/all`
3. **방 나가기**: `POST /rooms/{roomId}/leave`
4. **방 삭제**: `DELETE /rooms/{roomId}`

## 사용법

1. **방 생성**: 방 제목을 입력하고 "방 생성" 버튼 클릭
2. **방 참가**: 방 ID를 입력하고 "방 참가" 버튼 클릭
3. **미디어 제어**: 하단 아이콘으로 카메라/마이크/화면공유 제어
4. **채팅**: 우측 채팅창에서 텍스트 메시지 전송
5. **참가자**: 참가자 아이콘 클릭으로 참가자 목록 확인

## 기술 스택

- WebRTC (RTCPeerConnection)
- WebSocket (실시간 시그널링)
- MediaDevices API (카메라/마이크/화면공유)
- React Hooks

## 주의사항

- HTTPS 환경에서만 완전히 동작합니다 (카메라/마이크 접근)
- 방화벽이나 NAT 환경에서는 STUN/TURN 서버 설정이 필요할 수 있습니다
- 현재 Google STUN 서버를 사용합니다: `stun:stun.l.google.com:19302`