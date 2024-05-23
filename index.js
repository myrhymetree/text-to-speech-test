import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { sample } from "./sample.js";

const openai = new OpenAI();
const speechFile = path.resolve("./speech.mp3");

async function main() {
  let lines = sample.trim().split('\n');

  let buffer = [];
  let currentCharacter = '';
  let allAudioBuffers = [];

  for (let line of lines) {
    let match = line.match(/\[(.*?)\]/);
    if (match) {
      let character = match[1];
      if (currentCharacter && character !== currentCharacter) {
        // 등장인물이 바뀌면 버퍼 내용 서버에 전송 및 음성 생성
        const audioBuffer = await sendToServer(buffer.join('\n'), currentCharacter);
        allAudioBuffers.push(audioBuffer);
        buffer = [];
      }
      currentCharacter = character;
    }
    buffer.push(line);
  }

  if (buffer.length > 0) {
    const audioBuffer = await sendToServer(buffer.join('\n'), currentCharacter);
    allAudioBuffers.push(audioBuffer);
  }

  const combinedAudioBuffer = Buffer.concat(allAudioBuffers);
  await fs.promises.writeFile(speechFile, combinedAudioBuffer);
}

async function sendToServer(content, character) {
  console.log('Sending to server:');
  console.log(content);

  // let gender;
  let name;

  const jsonString = await fs.promises.readFile('characters.json', 'utf8');
  const data = JSON.parse(jsonString);

  for (let user of data.users) {
    if (character === user.name) {
      // gender = user.gender;
      name = user.name;
      break;
    }
  }

  let mp3;

  if (name === "김첨지") {
    mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: content,
    });
  } else if(name === "아내") {
    mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: content,
    });
  } else if(name === "치삼") {
    mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: content,
    });
  } else if(name === "학생") {
    mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "fable",
      input: content,
    });
  } else if(name === "여학생") {
    mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer",
      input: content,
    });
  } else {
    mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: content,
    });
  }

  const audioBuffer = Buffer.from(await mp3.arrayBuffer());
  return audioBuffer;
}

main();