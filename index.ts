// import { runEc2WebServer } from './ec2-webserver';
// import { runEcsDocker } from './ecs-docker';
import { runTemplate } from './template';

// Run the ECS Docker
// const { frontEndUrl } = runEcsDocker();
// export { frontEndUrl };

// Run the EC2 Web Sever
// const ec2WebServerPromise = runEc2WebServer();
// const result = ec2WebServerPromise.then(({ publicIp, publicHostname }) => [publicIp, publicHostname]);
// export { result };

// Run Template 
const output = runTemplate();
export { output };
