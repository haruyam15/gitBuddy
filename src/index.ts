import validateRepo from './utils/validateRepo.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { exec } from 'child_process'; // exec 임포트 추가

let userName = '';

// Git 학습 세션 시작
export const startSession = async () => {
  userName = await promptUser();
  console.log(
    chalk.green(`
    반갑습니다 ${userName}님! 제가 Git 사용을 도와드리겠습니다. 😀
    `)
  );

  await guideClone();
};

// 사용자에게 이름을 입력받는 함수
const promptUser = async (): Promise<string> => {
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

  return answers.userName; // 이름 반환
};

// 클론 실습 안내
const guideClone = async () => {
  console.log(chalk.blue('이제 git 레포지토리를 clone 해볼 거예요!'));
  console.log(
    chalk.blue(
      `아래 링크에서 레포지토리를 fork한 후, ${userName}님의 GitHub 레포지토리 주소를 입력해 주세요.`
    )
  );
  console.log(chalk.blue('https://github.com/haruyam15/gitbuddy-practice'));
  console.log(
    chalk.blue(
      '다음과 같은 형식으로 입력해보세요: git clone https://github.com/{사용자ID}/{레포지토리이름}'
    )
  );

  await promptCloneCommand(); // 클론 명령어 입력 받기
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
        return '올바른 형식이 아닙니다. "git clone https://github.com/{사용자ID}/{레포지토리이름}" 형식으로 입력해 주세요.';
      },
    },
  ]);

  await handleCloneCommand(cloneCommand); // 입력된 클론 명령어 처리
};

// 클론 명령어 처리
const handleCloneCommand = async (command: string) => {
  const repoUrl = command.split(' ')[2]; // 레포지토리 주소 추출
  const validationResponse = await validateRepo(repoUrl); // 레포지토리 주소 유효성 검사

  if (validationResponse.valid) {
    console.log(chalk.green('레포지토리를 클론 중입니다...'));

    // 실제 클론 명령어 실행
    exec(command, (error, stderr) => {
      if (error) {
        console.error(chalk.red(`클론 실패: ${error.message}`));
        return;
      }
      if (stderr) {
        console.error(chalk.red(`오류: ${stderr}`));
        return;
      }
      console.log(
        chalk.green(`
        ✨ 훌륭해요! 레포지토리를 성공적으로 클론했습니다. ✨ 
        `)
      );
    });
  } else {
    console.log(chalk.red(validationResponse.message));
    await promptCloneCommand(); // 오류 시 재입력 요청
  }
};
