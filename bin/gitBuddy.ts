#!/usr/bin/env node
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
  const answers = await inquirer.prompt<{ userName: string}>([
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
};

program.parse(process.argv);