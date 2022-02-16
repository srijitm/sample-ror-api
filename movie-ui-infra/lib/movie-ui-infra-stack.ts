import { Stack, StackProps, aws_ecs_patterns, aws_ecs as ecs, aws_ec2 as ec2, aws_ssm as ssm } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

export class MovieUiInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creating an ECS cluster
    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc: ec2.Vpc.fromLookup(this, 'vpc', {
        vpcId: 'vpc-037b1138ae24c3cf9'
      }),
      clusterName: `acme-movie-ror-ui-cluster`
    })

    const apiUrl = ssm.StringParameter.fromStringParameterName(this, 'dbHost', '/acme/demo/api/movie/endpoint')

    const masterKey = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'masterKey', {
      parameterName: '/acme/demo/ui/movie/key'
    })

    const loadBalancedFargateService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, 'service', {
      cluster,
      memoryLimitMiB: 2048,
      cpu: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', "movie-ui")),
        containerName: 'movie-ui',
        containerPort: 3001,
        environment: {
          REACT_APP_API_URL: apiUrl.stringValue,
        },
        secrets: {
          RAILS_MASTER_KEY: ecs.Secret.fromSsmParameter(masterKey)
        }
      },
      serviceName: 'movie-ui-service',
      assignPublicIp: true,
    });
    
    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/",
      port: "3001"
    });

  }
}
