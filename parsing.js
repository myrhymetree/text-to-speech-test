import { sample } from "./sample.js";

function parseAndSend(sample) {
    // 줄 단위로 분리
    let lines = sample.trim().split('\n');
    
    let buffer = [];
    let currentCharacter = '';

    for (let line of lines) {
        // 대괄호 안의 등장인물 추출
        let match = line.match(/\[(.*?)\]/);
        if (match) {
            let character = match[1];
            if (currentCharacter && character !== currentCharacter) {
                // 등장인물이 바뀌면 버퍼 내용 서버에 전송
                sendToServer(buffer.join('\n'));
                buffer = [];
            }
            currentCharacter = character;
        }
        buffer.push(line);
    }

    // 마지막 버퍼 내용 전송
    if (buffer.length > 0) {
        sendToServer(buffer.join('\n'));
    }
}

// 서버에 전송하는 함수 (예시로 콘솔에 출력)
function sendToServer(content) {
    console.log('Sending to server:');
    console.log(content);
    // 실제 서버에 전송하는 코드가 여기에 들어갑니다.
    // 예: fetch('your-server-url', { method: 'POST', body: content });
}

parseAndSend(sample);