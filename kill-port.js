// kill-port.js
import { exec } from 'child_process';

const port = 5173;

exec(`lsof -i :${port} -t`, (err, stdout, stderr) => {
  if (err || !stdout) {
    console.log(`✅ 포트 ${port}는 사용 중이지 않음`);
    process.exit(0);
  }

  const pids = stdout.split('\n').filter(Boolean);
  pids.forEach((pid) => {
    exec(`kill -9 ${pid}`, (killErr) => {
      if (killErr) {
        console.error(`❌ 프로세스 ${pid} 종료 실패`);
      } else {
        console.log(`🔪 포트 ${port} 점유 중인 프로세스 ${pid} 종료`);
      }
    });
  });
});