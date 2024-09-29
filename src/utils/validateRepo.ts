import axios from 'axios';

// 레포지토리 유효성 검사 함수
const validateRepo = async (repoUrl: string) => {
  const repoRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/;
  const match = repoUrl.match(repoRegex);

  if (!match) {
    return {
      valid: false,
      message:
        '레포지토리 주소 형식이 잘못된 것 같아요. "https://github.com/{사용자ID}/{레포지토리이름}" 형식으로 입력해 주세요.',
    };
  }

  const userName = match[1];
  const repoName = match[2];

  // GitHub API를 사용하여 레포지토리 존재 여부 확인
  try {
    const response = await axios.get(`https://api.github.com/repos/${userName}/${repoName}`);
    if (response.status === 200) {
      return { valid: true };
    }
  } catch (error) {
    return {
      valid: false,
      message: '레포지토리를 찾을 수 없는 것 같아요. 레포지토리 주소를 다시 확인해 주세요.',
    };
  }

  return { valid: false };
};

export default validateRepo;
