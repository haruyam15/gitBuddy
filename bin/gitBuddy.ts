#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { startSession } from '../src/index.js'; // index.ts에서 startSession 함수를 가져옵니다.

const program = new Command();

program
  .name('gitbuddy')
  .description('Your buddy for mastering Git commands!')
  .version('1.0.0');

// 시작 명령어 정의
program.command('start')
  .description('Start the Git learning session')
  .action(async () => {
    console.log(chalk.blue('안녕하세요. 저는 gitbuddy에요!'));
    await startSession(); // Git 학습 세션 시작
  });

program.parse(process.argv);