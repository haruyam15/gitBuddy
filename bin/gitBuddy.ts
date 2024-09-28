#!/usr/bin/env node
import validateRepo from '../src/utils/validateRepo.js';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';

const program = new Command();

program
  .name('gitbuddy')
  .description('Your buddy for mastering Git commands!')
  .version('1.0.0');

// 시작 명령어 정의
program.command('start')
  .description('Start the Git learning session')
  .action(() => {
    console.log(chalk.blue('안녕하세요. 저는 gitbuddy에요!'));
    promptUser();
  });

// 사용자에게 이름을 입력받는 함수
const promptUser = async () => {
  const answers = await inquirer.prompt<{ userName: string }>([
    {
      type: 'input',
      name: 'userName',
      message: '먼저, 제가 불러드릴 이름을 입력해주세요 :',
      validate(value) {
        if (value.length !== 0) {
          return true;
        }
        return '이름을 입력해주세요.';
      },
    },
  ]);

  console.log(chalk.green(`반갑습니다, ${answers.userName}님!`));
  console.log(chalk.green('제가 Git 사용을 도와드리겠습니다.'));

  // 레포지토리 클론 안내
  await guideClone();
};

// 클론 실습 안내
const guideClone = async () => {
  console.log(chalk.blue('이제 git 레포지토리를 clone 해볼 거예요!'));
  console.log(chalk.blue('아래 링크에서 레포지토리를 fork한 후, 주소를 입력해주세요:'));
  console.log(chalk.blue('https://github.com/haruyam15/gitbuddy-practice'));
  console.log(chalk.blue('다음과 같은 형식으로 입력해보세요: git clone {주소}'));

  // 사용자 입력 받기
  await promptCloneCommand(); // 수정된 부분
};

// 클론 명령어 입력을 위한 함수
const promptCloneCommand = async () => {
  const { cloneCommand } = await inquirer.prompt<{ cloneCommand: string }>([
    {
      type: 'input',
      name: 'cloneCommand',
      message: 'git clone 명령어를 입력하세요:',
      validate(value) {
        if (value.startsWith('git clone ') && value.split(' ').length === 3) {
          return true;
        }
        return '올바른 형식이 아닙니다. "git clone {주소}" 형식으로 입력해 주세요.';
      },
    },
  ]);

  // 사용자의 입력 처리
  await handleCloneCommand(cloneCommand);
};

// 클론 명령어 처리
const handleCloneCommand = async (command: string) => {
  const validationResponse = await validateRepo(command.split(' ')[2]); // 레포지토리 주소 유효성 검사
  if (validationResponse.valid) {
    console.log(chalk.green('훌륭해요! 레포지토리를 성공적으로 클론했습니다.'));
  } else {
    console.log(chalk.red(validationResponse.message));
    await promptCloneCommand();
  }
};

program.parse(process.argv);