import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

export const run = () => {
// Create a Network load balancer to listen for requests and route them to the container.
  const listener = new awsx.elasticloadbalancingv2.NetworkListener('nginx', {
    port: 80
  });

  // Create ecs fargate service
  new awsx.ecs.FargateService('nginx', {
    desiredCount: 1,
    taskDefinitionArgs: {
      containers: {
        nginx: {
          image: awsx.ecs.Image.fromPath('nginx', './ecs-docker/app'),
          memory: 512,
          portMappings: [listener]
        }
      }
    }
  });

  return { frontEndUrl:  pulumi.interpolate`http://${listener.endpoint.hostname}/` };
};

